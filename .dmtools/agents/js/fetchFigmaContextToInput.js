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
    console.log('[figma] pre-action received inputFolderPath=' + (folder || '<missing>'));
    if (!safeInputFolder(folder)) {
        console.warn('Skipping Figma context fetch: input folder is unavailable or unsafe');
        return;
    }

    try {
        console.log('[figma] Running fetch-figma-context.sh');
        cli_execute_command({
              // cli_execute_command runs from the repository root. Keep the
              // command direct: its executor does not reliably support a
              // nested bash -c wrapper.
              command: 'bash .dmtools/agents/scripts/fetch-figma-context.sh ' + folder
        });
        console.log('[figma] fetch-figma-context.sh completed');
    } catch (error) {
        // The script itself writes figma_context_error.md, which tells intake to
        // stop rather than inventing node mappings. Do not make a missing Figma
        // token fatal for non-design Epics.
        console.warn('Figma context fetch failed:', error);
        if (error && error.stack) console.warn(error.stack);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { action: action, safeInputFolder: safeInputFolder };
}
