export type MethodStep = {
  number: string;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
};

export type Topic = { id: string; label: string };

export const methodologySteps: MethodStep[] = [
  { number: '01', title: 'Diagnostic Voice Assessment', description: 'In 3 minutes, our AI analyzes your active vocabulary breadth, accent phoneme stress, and cadence pauses to pinpoint your CEFR speaking baseline.', metricLabel: 'Acoustic Precision:', metricValue: 'Sub-word FFT analysis' },
  { number: '02', title: 'Daily 15-Min Micro-Dialogues', description: 'Engage in low-pressure, lifelike spoken interactions tailored to your world: salary renegotiations, high-stakes coffee chats, and IELTS oral prompts.', metricLabel: 'Response Latency:', metricValue: '< 320ms Real-Time' },
  { number: '03', title: 'Surgical Accent Alignment', description: 'Receive live tongue and palate placement schematics for tricky vowel pairs, along with automated spaced-repetition idiom cards.', metricLabel: 'Recall Guarantee:', metricValue: '96% Retention at 30 days' },
];

export const learningTopics: Topic[] = [
  { id: 'business', label: '💼 Business & Tech Pitching' },
  { id: 'academic', label: '🎓 IELTS & Academic Prep' },
  { id: 'everyday', label: '🌍 Everyday Casual Conversation' },
  { id: 'travel', label: '✈️ Relocation & Travel Fluency' },
];
