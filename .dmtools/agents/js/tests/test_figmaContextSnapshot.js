const assert = require('assert');
const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '../../..');
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'figma-mcp-context-'));
const contextFile = path.join(tempRoot, 'context.json');
const repoDir = path.join(tempRoot, 'figma-context');
const inputDir = path.join(tempRoot, 'input');
fs.mkdirSync(inputDir);

fs.writeFileSync(contextFile, JSON.stringify({
  fileKey: 'abc123',
  sourceUrl: 'https://www.figma.com/design/abc123/Test',
  target: {
    id: '2:95',
    name: 'Desktop',
    bounds: { width: 1440, height: 900 }
  },
  nodeCandidates: [{
    id: '2:95',
    name: 'Desktop',
    type: 'FRAME',
    bounds: { width: 1440, height: 900 },
    url: 'https://www.figma.com/design/abc123/Test?node-id=2-95'
  }]
}, null, 2));

childProcess.execFileSync(process.execPath, [
  path.join(root, 'agents/scripts/save-figma-mcp-context.js'),
  'https://www.figma.com/design/abc123/Test?node-id=2-95',
  contextFile
], { env: { ...process.env, FIGMA_CONTEXT_REPO_DIR: repoDir }, stdio: 'pipe' });

const result = childProcess.spawnSync(process.execPath, [
  path.join(root, 'agents/scripts/fetch-figma-context.js'),
  inputDir
], {
  env: {
    ...process.env,
    FIGMA_CONTEXT_REPO_DIR: repoDir,
    FIGMA_CONTEXT_CACHE_DIR: path.join(tempRoot, 'cache'),
    FIGMA_TOKEN: '',
    FIGMA_SOURCE_URL: 'https://www.figma.com/design/abc123/Test?node-id=2-95'
  },
  encoding: 'utf8'
});

assert.strictEqual(result.status, 0, result.stderr);
assert.match(result.stdout, /Using repository Figma MCP context/);
const generated = JSON.parse(fs.readFileSync(path.join(inputDir, 'figma_context.json'), 'utf8'));
assert.strictEqual(generated.fileKey, 'abc123');
assert.strictEqual(generated.target.id, '2:95');
assert.strictEqual(fs.existsSync(path.join(inputDir, 'figma_context_error.md')), false);

console.log('Figma MCP repository snapshot checks passed');
