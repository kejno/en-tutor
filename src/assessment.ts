import coachAvatar from './assets/coach-avatar.png';

export type ConversationMessage = {
  speaker: 'AI' | 'ME';
  text: string;
  tone: 'neutral' | 'blue';
};

export const assessmentDemo = {
  conversation: [
    { speaker: 'AI', text: '“That migration strategy makes total sense. Could you elaborate on how your team addressed the latency spike during the initial deployment phase?”', tone: 'neutral' },
    { speaker: 'ME', text: '“Honestly, we make mistakes yesterday when calculating database failovers, but caching salvaged the response window.”', tone: 'blue' },
  ] satisfies ConversationMessage[],
  score: 94,
  metrics: [
    { label: 'Phonetic Clarity', value: 92 },
    { label: 'Conversational Flow (138 WPM)', value: 88 },
    { label: 'Lexical Sophistication', value: 80 },
  ],
};

export function renderAssessmentCard(): HTMLElement {
  const card = document.createElement('article');
  card.className = 'assessment-card';
  card.dataset.testid = 'assessment-card';
  card.setAttribute('aria-label', 'Демонстрация оценки речи Emma');
  card.innerHTML = `
    <header class="assessment-header">
      <img class="coach-avatar" src="${coachAvatar}" alt="Emma" width="40" height="40" />
      <div><div><strong>Emma • AI Native Coach</strong> <span class="live-pill">Live Voice</span></div>
      <p>Scenario: Tech Lead Architecture Pitch &amp; Executive Q&amp;A</p></div>
      <span class="demo-label">Статичная демонстрация</span>
    </header>
    <div class="assessment-panels">
      <section class="conversation-panel" aria-label="Диалог">
        <div class="conversation-messages"></div>
        <aside class="grammar-correction" aria-label="Исправление грамматики">
          <div><strong>🪄 Real-Time Grammar Alignment</strong><span>Polite Reformulation</span></div>
          <p>Instead of <del>“we make mistakes yesterday”</del>, try <ins>“we made mistakes yesterday”</ins> or <ins>“we encountered an oversight”</ins>.</p>
        </aside>
        <div class="demo-input"><span aria-hidden="true">♩</span><input disabled aria-label="Демонстрационный ввод: запись и отправка недоступны" placeholder="Tap mic or speak your response aloud..." /><button disabled aria-label="Запись недоступна в демонстрации">◖ıı◗</button></div>
      </section>
      <section class="score-panel" aria-label="Оценка речи">
        <div class="score-heading"><strong>Live Fluency Dial</strong><span>CEFR: C1 Native</span></div>
        <div class="score-ring" data-testid="assessment-score"><strong>${assessmentDemo.score}%</strong><span>ACCURACY</span></div>
        <div class="metrics"></div>
        <p class="assessment-insight">⊙ Hesitation pauses decreased by 42% since session 3.</p>
      </section>
    </div>`;
  const messages = card.querySelector('.conversation-messages')!;
  assessmentDemo.conversation.forEach((message) => {
    const row = document.createElement('div');
    row.className = `message-row message-${message.tone}`;
    row.dataset.testid = 'conversation-message';
    const avatar = document.createElement('span');
    avatar.className = 'message-avatar';
    avatar.textContent = message.speaker;
    const content = document.createElement('div');
    content.className = 'message-content';
    const text = document.createElement('p');
    text.textContent = message.text;
    content.append(text);
    if (message.speaker === 'AI') {
      const status = document.createElement('small');
      status.textContent = '◀ 0.9x Pitch • Natural Pace';
      content.append(status);
    }
    row.append(avatar, content);
    messages.append(row);
  });
  const metrics = card.querySelector('.metrics')!;
  assessmentDemo.metrics.forEach((metric) => {
    const row = document.createElement('div');
    row.className = 'metric';
    row.innerHTML = `<div class="metric-label"><span>${metric.label}</span><strong>${metric.value}%</strong></div><div class="progress-track" role="progressbar" aria-label="${metric.label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${metric.value}"><span style="width:${metric.value}%"></span></div>`;
    metrics.append(row);
  });
  return card;
}
