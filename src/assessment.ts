export type ConversationMessage = {
  speaker: 'Emma' | 'FluentAI';
  text: string;
  status: string;
  tone: 'blue' | 'green' | 'neutral';
};

export const assessmentDemo = {
  conversation: [
    {
      speaker: 'Emma',
      text: 'I’d like to improve my speaking skills, especially for meetings.',
      status: 'Natural expression',
      tone: 'neutral',
    },
    {
      speaker: 'FluentAI',
      text: 'You’re making strong progress. Let’s practice a confident response together.',
      status: 'Excellent flow',
      tone: 'blue',
    },
    {
      speaker: 'Emma',
      text: 'That sounds helpful — I’m ready to try.',
      status: 'Clear and confident',
      tone: 'green',
    },
  ] satisfies ConversationMessage[],
  score: 94,
  metrics: [
    { label: 'Pronunciation Clarity', value: 95 },
    { label: 'Conversational Flow', value: 88 },
    { label: 'Lexical Sophistication', value: 80 },
  ],
  vocabulary: 72,
};

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

export function renderAssessmentCard(): HTMLElement {
  const card = element('article', 'assessment-card');
  card.dataset.testid = 'assessment-card';

  const conversation = element('section', 'conversation-panel');
  const conversationHeading = element('div', 'panel-heading');
  conversationHeading.innerHTML = '<div><span class="eyebrow">Live conversation</span><h3>Emma · AI Native Coach</h3></div><span class="live-pill">Live demo</span>';
  card.append(conversationHeading);

  const messages = element('div', 'conversation-messages');
  assessmentDemo.conversation.forEach((message) => {
    const row = element('div', `message-row message-${message.tone}`);
    row.dataset.testid = 'conversation-message';
    row.innerHTML = `<div class="message-avatar">${message.speaker === 'Emma' ? 'E' : '✦'}</div><div class="message-content"><div class="message-meta"><strong>${message.speaker}</strong><span>${message.status}</span></div><p>${message.text}</p></div>`;
    messages.append(row);
  });
  conversation.append(messages);

  const scorePanel = element('section', 'score-panel');
  scorePanel.innerHTML = '<div class="panel-heading"><div><span class="eyebrow">Speech assessment</span><h3>Your fluency snapshot</h3></div><span class="success-dot">✓</span></div>';
  const score = element('div', 'score-ring');
  score.dataset.testid = 'assessment-score';
  score.innerHTML = `<strong>${assessmentDemo.score}%</strong><span>Overall score</span>`;
  scorePanel.append(score);

  const metrics = element('div', 'metrics');
  assessmentDemo.metrics.forEach((metric) => {
    const metricRow = element('div', 'metric');
    metricRow.innerHTML = `<div class="metric-label"><span>${metric.label}</span><strong>${metric.value}%</strong></div><div class="progress-track"><span style="width: ${metric.value}%"></span></div>`;
    metrics.append(metricRow);
  });
  const vocabulary = element('div', 'vocabulary');
  vocabulary.innerHTML = `<div class="metric-label"><span>Vocabulary Growth</span><strong>${assessmentDemo.vocabulary}%</strong></div><div class="progress-track orange"><span style="width: ${assessmentDemo.vocabulary}%"></span></div><small>Personalized words discovered in conversation</small>`;
  metrics.append(vocabulary);
  scorePanel.append(metrics);

  card.append(conversation, scorePanel);
  return card;
}
