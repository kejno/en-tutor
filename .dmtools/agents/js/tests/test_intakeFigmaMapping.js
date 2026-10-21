const assert = require('assert');
const intake = require('../createIntakeTickets.js');

assert.doesNotThrow(() => intake.validateFigmaMapping({
    summary: 'Hero',
    figma: { nodeId: '2:452', url: 'https://www.figma.com/design/file-key/Target?node-id=2-452' }
}));
assert.throws(
    () => intake.validateFigmaMapping({ summary: 'Hero', figma: { nodeId: '2:452' } }),
    /Invalid figma mapping/
);

const description = intake.appendFigmaReference('h3. Goal\n\nBuild the hero.', {
    nodeId: '2:452',
    nodeName: 'HERO SECTION',
    url: 'https://www.figma.com/design/file-key/Target?node-id=2-452',
    bounds: { width: 1440, height: 720 }
});
assert.match(description, /HERO SECTION/);
assert.match(description, /\{\{2:452\}\}/);
assert.match(description, /1440×720 px/);

const entries = [
    { type: 'Story', summary: 'No Figma needed' },
    { type: 'Story', summary: 'Malformed optional mapping', figma: { nodeId: '2:452' } }
];
assert.doesNotThrow(() => intake.prepareFigmaMappings(entries));
assert.strictEqual(entries[1].figma, undefined, 'Malformed optional mappings must be ignored, not block intake');

const strictParams = {
    ticket: { fields: { issuetype: { name: 'Epic' }, labels: ['figma_required'] } }
};
assert.strictEqual(intake.sourceRequiresFigmaMappings('ET-99', strictParams), true);
assert.throws(
    () => intake.prepareFigmaMappings([{ type: 'Story', summary: 'Missing mapping' }], 'ET-99', strictParams),
    /figma_required/
);
assert.throws(
    () => intake.prepareFigmaMappings([{ type: 'Story', summary: 'Malformed mapping', figma: { nodeId: '2:2' } }], 'ET-99', strictParams),
    /Invalid figma mapping/
);

const verticalPlan = [
    { type: 'Story', tempId: 'story-ui', summary: 'Save a lesson draft', storyPoints: 3 },
    {
        type: 'Story',
        tempId: 'story-publish',
        summary: 'Publish a lesson draft',
        storyPoints: 5,
        blockedBy: ['story-ui'],
        integrates: ['ET-42']
    }
];
assert.doesNotThrow(() => intake.validateVerticalSlices(verticalPlan));
assert.doesNotThrow(() => intake.validateVerticalSlices([
    { type: 'Story', summary: 'Use an existing dependency', storyPoints: 1, blockedBy: ['ET-42'] }
]));
assert.throws(
    () => intake.validateVerticalSlices([{ type: 'Story', summary: 'Too large', storyPoints: 6 }]),
    /1 to 5/
);
assert.throws(
    () => intake.validateVerticalSlices([{ type: 'Story', summary: 'No estimate' }]),
    /storyPoints/
);
assert.throws(
    () => intake.validateVerticalSlices([
        { type: 'Story', tempId: 'self', summary: 'Self blocker', storyPoints: 1, blockedBy: ['self'] }
    ]),
    /cannot depend/
);
assert.throws(
    () => intake.validateVerticalSlices([
        { type: 'Story', tempId: 'one', summary: 'Duplicate dependency', storyPoints: 1, blockedBy: ['ET-42'], integrates: ['ET-42'] }
    ]),
    /Duplicate or conflicting/
);
assert.strictEqual(intake.isJiraIssueKey('ET-42'), true);
assert.strictEqual(intake.isJiraIssueKey('temp-42'), false);

console.log('Intake Figma mapping checks passed');
