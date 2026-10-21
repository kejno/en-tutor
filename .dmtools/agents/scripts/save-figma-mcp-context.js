#!/usr/bin/env node
'use strict';

/*
 * Persist a sanitized context produced by local Codex + Figma MCP.
 * The input must contain fileKey, target and nodeCandidates. It must not
 * contain a token or the full Figma document.
 *
 * Usage:
 *   node save-figma-mcp-context.js <figma-url> <context-json> [reference-image]
 */

const fs = require('node:fs');
const path = require('node:path');

const [href, contextFile, imageFile] = process.argv.slice(2);
if (!href || !contextFile) {
  throw new Error('Usage: save-figma-mcp-context.js <figma-url> <context-json> [reference-image]');
}

const url = new URL(href);
const parts = url.pathname.split('/').filter(Boolean);
if (!['design', 'file'].includes(parts[0]) || !parts[1]) {
  throw new Error('The Figma URL must contain a /design/<fileKey>/ or /file/<fileKey>/ path');
}

const fileKey = parts[1];
const requestedNodeId = url.searchParams.get('node-id');
const nodePart = (requestedNodeId || 'root').replace(/[^a-zA-Z0-9_-]/g, '_');
const outputDir = process.env.FIGMA_CONTEXT_REPO_DIR ||
  path.resolve(__dirname, '../..', 'figma-context');
const context = JSON.parse(fs.readFileSync(contextFile, 'utf8'));

if (!context || context.fileKey !== fileKey || !context.target ||
    !Array.isArray(context.nodeCandidates)) {
  throw new Error('Context must contain matching fileKey, target and nodeCandidates[]');
}
if (!context.target.id || !context.target.name || !context.target.bounds) {
  throw new Error('Context target must contain id, name and bounds');
}
if (requestedNodeId && context.target.id !== requestedNodeId.replace(/-/g, ':')) {
  throw new Error('Context target does not match the node-id in the Figma URL');
}
if (JSON.stringify(context).match(/(?:FIGMA_TOKEN|X-Figma-Token|Bearer\s+)/i)) {
  throw new Error('Refusing to persist a context that appears to contain credentials');
}

fs.mkdirSync(outputDir, { recursive: true });
let referenceImage;
if (imageFile) {
  referenceImage = path.basename(imageFile);
  fs.copyFileSync(imageFile, path.join(outputDir, referenceImage));
}

const snapshot = {
  cachedAt: Date.now(),
  context: {
    ...context,
    sourceUrl: context.sourceUrl || href,
    fileKey,
    referenceImage,
    instructions: context.instructions ||
      'Use exact nodeCandidates for visual Stories; never invent Figma node IDs.'
  }
};
fs.writeFileSync(
  path.join(outputDir, 'context-' + fileKey + '-' + nodePart + '.json'),
  JSON.stringify(snapshot, null, 2) + '\n',
  'utf8'
);
console.log('Saved sanitized Figma MCP context to ' + outputDir);
