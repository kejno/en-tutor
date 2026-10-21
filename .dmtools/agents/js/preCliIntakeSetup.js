/** Prepare tracker and Figma context before Epic intake. */

var fetchEpicsToInput;
var fetchFigmaContextToInput;

try {
    fetchEpicsToInput = require('./fetchEpicsToInput.js');
    console.log('[intake] Loaded fetchEpicsToInput.js');
    fetchFigmaContextToInput = require('./fetchFigmaContextToInput.js');
    console.log('[intake] Loaded fetchFigmaContextToInput.js');
} catch (error) {
    console.error('[intake] Failed to load a pre-CLI module:', error);
    if (error && error.stack) console.error(error.stack);
    throw error;
}

function action(params) {
    var folder = params && params.inputFolderPath;
    console.log('[intake] preCli start; inputFolderPath=' + (folder || '<missing>'));

    try {
        console.log('[intake] Starting Jira context fetch');
        fetchEpicsToInput.action(params);
        console.log('[intake] Jira context fetch finished');
    } catch (error) {
        console.error('[intake] Jira context fetch threw:', error);
        if (error && error.stack) console.error(error.stack);
        throw error;
    }

    try {
        console.log('[intake] Starting Figma context fetch');
        fetchFigmaContextToInput.action(params);
        console.log('[intake] Figma context fetch finished');
    } catch (error) {
        console.error('[intake] Figma context fetch threw:', error);
        if (error && error.stack) console.error(error.stack);
        throw error;
    }

    console.log('[intake] preCli finished');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { action: action };
}
