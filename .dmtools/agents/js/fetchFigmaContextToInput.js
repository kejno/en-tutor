/**
 * Fetch Figma design context for an intake run.
 *
 * The Figma integration bundled with dmtools can render an already-known node,
 * but cannot list a file's node tree. This pre-action calls the project script
 * that reads the Figma REST API and writes a compact, deterministic map to the
 * intake input folder. The AI then assigns one of those exact nodes to every
 * visual Story it creates.
 */

function safeInputFolder(folder) {
    return typeof folder === 'string' && /^[A-Za-z0-9_./-]+$/.test(folder);
}

function action(params) {
    var folder = params && params.inputFolderPath;
    if (!safeInputFolder(folder)) {
        console.warn('Skipping Figma context fetch: input folder is unavailable or unsafe');
        return;
    }

    try {
        cli_execute_command({
            // ai-teammate.yml runs dmtools from .dmtools, so this path is
            // relative to that working directory. Keep the command direct:
            // DMTools' CLI executor does not reliably support nested bash -c.
            command: 'bash agents/scripts/fetch-figma-context.sh ' + folder
        });
    } catch (error) {
        // The script itself writes figma_context_error.md, which tells intake to
        // stop rather than inventing node mappings. Do not make a missing Figma
        // token fatal for non-design Epics.
        console.warn('Figma context fetch failed:', error);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { action: action, safeInputFolder: safeInputFolder };
}
