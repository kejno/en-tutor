#!/usr/bin/env node
'use strict';

/*
 * Resolve Figma URLs mentioned in an Epic into a node map that an intake agent
 * can use without guessing. It deliberately stores metadata and a rendered
 * reference image, never the API token or the full Figma document.
 */

const fs = require('node:fs');
const path = require('node:path');

const inputDir = process.argv[2];
if (!inputDir) {
  throw new Error('An intake input directory is required');
}

const requestPath = path.join(inputDir, 'request.md');
const commentsPath = path.join(inputDir, 'comments.md');
const source = [requestPath, commentsPath]
  .filter(fs.existsSync)
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');

function writeError(message) {
  fs.writeFileSync(path.join(inputDir, 'figma_context_error.md'),
    `⚠ BLOCKER: ${message}\n`, 'utf8');
}

function findFigmaUrl(text) {
  const match = text.match(/https?:\/\/www\.figma\.com\/(?:design|file)\/[^\s)\]}>"\\]+/i);
  return match ? match[0].replace(/\\&/g, '&') : null;
}

function parseFigmaUrl(href) {
  const url = new URL(href);
  const parts = url.pathname.split('/').filter(Boolean);
  const kind = parts[0];
  const fileKey = parts[1];
  if (!['design', 'file'].includes(kind) || !fileKey) {
    throw new Error('the URL does not contain a Figma file key');
  }
  return {
    href,
    fileKey,
    baseUrl: `${url.origin}/${kind}/${fileKey}/${parts.slice(2).join('/')}`.replace(/\/$/, ''),
    requestedNodeId: url.searchParams.get('node-id') || null,
  };
}

function figmaNodeUrl(baseUrl, nodeId) {
  return `${baseUrl}?node-id=${encodeURIComponent(nodeId.replace(/:/g, '-'))}`;
}

function bounds(node) {
  const box = node.absoluteBoundingBox;
  if (!box) return null;
  return {
    x: Math.round(box.x * 100) / 100,
    y: Math.round(box.y * 100) / 100,
    width: Math.round(box.width * 100) / 100,
    height: Math.round(box.height * 100) / 100,
  };
}

function flatten(node, parentId, parentPath, all, candidates) {
  const item = {
    id: node.id,
    name: node.name || '',
    type: node.type || '',
    parentId: parentId || null,
    path: parentPath ? `${parentPath} / ${node.name || node.id}` : (node.name || node.id),
    visible: node.visible !== false,
    bounds: bounds(node),
    childCount: Array.isArray(node.children) ? node.children.length : 0,
  };
  all.push(item);
  if (item.visible && item.bounds && ['CANVAS', 'SECTION', 'FRAME', 'GROUP', 'COMPONENT', 'COMPONENT_SET'].includes(item.type)) {
    candidates.push(item);
  }
  for (const child of node.children || []) {
    flatten(child, node.id, item.path, all, candidates);
  }
}

function selectTargetNode(nodes, requestedNodeId) {
  if (requestedNodeId) {
    const normalized = requestedNodeId.replace(/-/g, ':');
    const requested = nodes.find(node => node.id === requestedNodeId || node.id === normalized);
    if (requested) return requested;
  }
  const frames = nodes.filter(node => node.type === 'FRAME' && node.visible && node.bounds);
  return frames.sort((a, b) => (b.bounds.width * b.bounds.height) - (a.bounds.width * a.bounds.height))[0] || null;
}

async function requestJson(url, token) {
  const response = await fetch(url, { headers: { 'X-Figma-Token': token } });
  if (!response.ok) throw new Error(`Figma API returned ${response.status}`);
  return response.json();
}

async function main() {
  const href = findFigmaUrl(source);
  if (!href) return;

  const token = process.env.FIGMA_TOKEN || process.env.FIGMA_API_KEY;
  if (!token) {
    writeError('Figma URL found, but FIGMA_TOKEN (or FIGMA_API_KEY) is not configured.');
    process.exitCode = 1;
    return;
  }

  let parsed;
  try {
    parsed = parseFigmaUrl(href);
  } catch (error) {
    writeError(`Figma URL could not be parsed: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  let file;
  try {
    file = await requestJson(`https://api.figma.com/v1/files/${parsed.fileKey}`, token);
  } catch (error) {
    writeError(`Could not read the Figma file: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const nodes = [];
  const candidates = [];
  flatten(file.document, null, '', nodes, candidates);
  const target = selectTargetNode(nodes, parsed.requestedNodeId);
  if (!target) {
    writeError('The Figma file contains no visible frame that can be used as an implementation target.');
    process.exitCode = 1;
    return;
  }

  const targetArea = target.bounds.width * target.bounds.height;
  const usefulCandidates = candidates
    .filter(node => node.bounds.width * node.bounds.height >= Math.max(100, targetArea * 0.002))
    .sort((a, b) => a.bounds.y - b.bounds.y || a.bounds.x - b.bounds.x)
    .slice(0, 500)
    .map(node => ({ ...node, url: figmaNodeUrl(parsed.baseUrl, node.id) }));

  const context = {
    sourceUrl: parsed.href,
    fileKey: parsed.fileKey,
    fileName: file.name || '',
    target: { ...target, url: figmaNodeUrl(parsed.baseUrl, target.id) },
    nodeCandidates: usefulCandidates,
    instructions: 'For every visual Story, select the narrowest matching nodeCandidate and copy its id, name, URL, and bounds into stories.json.figma. Do not invent node IDs.',
  };

  const contextPath = path.join(inputDir, 'figma_context.json');
  fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf8');

  try {
    const imageResponse = await requestJson(
      `https://api.figma.com/v1/images/${parsed.fileKey}?ids=${encodeURIComponent(target.id)}&format=png&scale=1`, token);
    const imageUrl = imageResponse.images && imageResponse.images[target.id];
    if (imageUrl) {
      const image = await fetch(imageUrl);
      if (!image.ok) throw new Error(`image download returned ${image.status}`);
      const imageName = `figma-reference-${target.id.replace(/:/g, '-')}.png`;
      fs.writeFileSync(path.join(inputDir, imageName), Buffer.from(await image.arrayBuffer()));
      context.referenceImage = imageName;
      fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf8');
    }
  } catch (error) {
    // The node map remains usable even if the image endpoint is unavailable.
    console.warn(`Could not download Figma reference image: ${error.message}`);
  }
}

main().catch(error => {
  writeError(`Unexpected Figma context error: ${error.message}`);
  process.exitCode = 1;
});
