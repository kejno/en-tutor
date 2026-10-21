/** Prepare tracker and Figma context before Epic intake. */

var fetchEpicsToInput = require('./fetchEpicsToInput.js');
var fetchFigmaContextToInput = require('./fetchFigmaContextToInput.js');

function action(params) {
    fetchEpicsToInput.action(params);
    fetchFigmaContextToInput.action(params);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { action: action };
}
