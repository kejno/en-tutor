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
const cacheDir = process.env.FIGMA_CONTEXT_CACHE_DIR || path.resolve(__dirname, '../..', 'cache', 'figma');
const cacheTtlMs = Number(process.env.FIGMA_CONTEXT_CACHE_TTL_MS || 24 * 60 * 60 * 1000);
const maxRetries = Number(process.env.FIGMA_API_MAX_RETRIES || 3);
const retryBaseMs = Number(process.env.FIGMA_API_RETRY_BASE_MS || 2000);
const maxInlineRetryMs = Number(process.env.FIGMA_API_MAX_INLINE_RETRY_MS || 30000);
const source = [process.env.FIGMA_SOURCE_URL]
  .filter(Boolean)
  .concat([requestPath, commentsPath].filter(fs.existsSync))
  .map(file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : file)
  .join('\n');

function writeError(message) {
  fs.writeFileSync(path.join(inputDir, 'figma_context_error.md'),
    `⚠ BLOCKER: ${message}\n`, 'utf8');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findFigmaUrl(text) {
  const match = text.match(/https?:\/\/www\.figma\.com\/(?:design|file)\/[^\s|)\]}>"\\]+/i);
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

function retryDelayMs(response, attempt) {
  const retryAfter = response && response.headers && response.headers.get('retry-after');
  const seconds = Number(retryAfter);
  if (Number.isFinite(seconds) && seconds >= 0) return seconds * 1000;
  return Math.min(retryBaseMs * Math.pow(2, attempt), maxInlineRetryMs);
}

function rateLimitError(response, attempt) {
  const delay = retryDelayMs(response, attempt);
  const error = new Error(`Figma API returned 429; retry after ${new Date(Date.now() + delay).toISOString()}`);
  error.isFigmaRateLimit = true;
  error.retryAt = Date.now() + delay;
  return error;
}

async function requestJson(url, token) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'X-Figma-Token': token } });
      if (response.ok) return response.json();

      const retryable = response.status === 429 || response.status >= 500;
      if (response.status === 429) {
        const error = rateLimitError(response, attempt);
        if (attempt === maxRetries || error.retryAt - Date.now() > maxInlineRetryMs) {
          throw error;
        }
        const delay = Math.max(0, error.retryAt - Date.now());
        console.warn(`Figma API returned 429; retrying in ${delay}ms (${attempt + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      if (!retryable || attempt === maxRetries) {
        throw new Error(`Figma API returned ${response.status}`);
      }
      const delay = retryDelayMs(response, attempt);
      console.warn(`Figma API returned ${response.status}; retrying in ${delay}ms (${attempt + 1}/${maxRetries})`);
      await sleep(delay);
    } catch (error) {
      lastError = error;
      if (error.isFigmaRateLimit || attempt === maxRetries || /Figma API returned (?:4(?!29)\d|[1-3]\d\d)/.test(error.message || '')) {
        throw error;
      }
      const delay = Math.min(retryBaseMs * Math.pow(2, attempt), 30000);
      console.warn(`Figma request failed (${error.message}); retrying in ${delay}ms (${attempt + 1}/${maxRetries})`);
      await sleep(delay);
    }
  }
  throw lastError || new Error('Figma request failed');
}

function cachePath(parsed) {
  const nodePart = (parsed.requestedNodeId || 'root').replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(cacheDir, `context-${parsed.fileKey}-${nodePart}.json`);
}

function backoffPath(parsed) {
  const nodePart = (parsed.requestedNodeId || 'root').replace(/[^a-zA-Z0-9_-]/g, '_');
  return path.join(cacheDir, `backoff-${parsed.fileKey}-${nodePart}.json`);
}

function readBackoff(parsed) {
  const file = backoffPath(parsed);
  if (!fs.existsSync(file)) return null;
  try {
    const backoff = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (Number.isFinite(backoff.retryAt) && backoff.retryAt > Date.now()) return backoff;
    fs.unlinkSync(file);
  } catch (error) {
    console.warn(`Ignoring unreadable Figma backoff cache: ${error.message}`);
  }
  return null;
}

function writeBackoff(parsed, error) {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(backoffPath(parsed), JSON.stringify({
    retryAt: error.retryAt || Date.now() + 5 * 60 * 1000,
    message: error.message,
    cachedAt: Date.now()
  }, null, 2), 'utf8');
}

function clearBackoff(parsed) {
  try { fs.unlinkSync(backoffPath(parsed)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}

function readCachedContext(parsed) {
  const file = cachePath(parsed);
  if (!fs.existsSync(file)) return null;
  try {
    const cached = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!cached.cachedAt || !cached.context || Date.now() - cached.cachedAt > cacheTtlMs) return null;
    const context = cached.context;
    if (context.fileKey !== parsed.fileKey) return null;
    const requestedTarget = parsed.requestedNodeId && parsed.requestedNodeId.replace(/-/g, ':');
    if (requestedTarget && (!context.target || context.target.id !== requestedTarget)) return null;
    return context;
  } catch (error) {
    console.warn(`Ignoring unreadable Figma context cache: ${error.message}`);
    return null;
  }
}

function writeContext(context, parsed, updateCache = true) {
  const contextPath = path.join(inputDir, 'figma_context.json');
  fs.writeFileSync(contextPath, JSON.stringify(context, null, 2), 'utf8');
  try { fs.unlinkSync(path.join(inputDir, 'figma_context_error.md')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (!updateCache) return;
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(cachePath(parsed), JSON.stringify({ cachedAt: Date.now(), context }, null, 2), 'utf8');
}

function restoreCachedImage(context) {
  if (!context.referenceImage) return;
  const cacheImage = path.join(cacheDir, context.referenceImage);
  if (fs.existsSync(cacheImage)) {
    fs.copyFileSync(cacheImage, path.join(inputDir, context.referenceImage));
  }
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

  const cachedContext = readCachedContext(parsed);
  if (cachedContext) {
    console.log(`Using cached Figma context for ${parsed.fileKey}`);
    writeContext(cachedContext, parsed, false);
    restoreCachedImage(cachedContext);
    return;
  }

  const backoff = readBackoff(parsed);
  if (backoff) {
    writeError(`Figma API rate limit is active. No request was made; retry after ${new Date(backoff.retryAt).toISOString()}.`);
    return;
  }

  let file;
  try {
    file = await requestJson(`https://api.figma.com/v1/files/${parsed.fileKey}`, token);
  } catch (error) {
    if (error.isFigmaRateLimit) {
      writeBackoff(parsed, error);
      writeError(`Figma API rate limit is active. ${error.message}`);
      return;
    }
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

  writeContext(context, parsed);
  clearBackoff(parsed);

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
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.copyFileSync(path.join(inputDir, imageName), path.join(cacheDir, imageName));
      writeContext(context, parsed);
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
