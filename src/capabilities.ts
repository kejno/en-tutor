export type CapabilityCard = {
  icon: string;
  title: string;
  description: string;
  sampleMessage?: string;
  indicator?: string;
  tags?: string[];
  miniGraph?: string;
};

export type LearningMetric = {
  value: string;
  label: string;
  description: string;
};

export const capabilityCards: CapabilityCard[] = [
  { icon: '♡', title: 'Zero-Judgment Conversational Haven', description: 'No human tutor sighs when you pause or repeat yourself for the fifth time. Emma adjusts her patience level to infinite.', sampleMessage: '“I finally stopped feeling ashamed of my French accent.”' },
  { icon: '∿', title: 'Phonetic Accent Tuner', description: 'Isolate difficult sound pairings with dynamic visual waveform overlays.', indicator: 'Match: 95%', miniGraph: 'M2 18 C10 18 10 4 18 4 S26 18 34 18 S42 4 50 4 S58 18 66 18' },
  { icon: '↗', title: '1,200+ Roleplay Scenarios', description: 'Experience every nuance before it counts, from artisan coffee to VC pitches.', tags: ['Coffee Shop', 'VC Pitch', 'French Interview'] },
  { icon: '▣', title: 'Adaptive Persistent Memory', description: 'Emma remembers your stumbling blocks and organically prompts them into tomorrow’s conversation.', indicator: 'Auto-synced' },
];

export const learningMetrics: LearningMetric[] = [
  { value: '3.4x', label: 'FLUENCY GAINS', description: 'Faster than traditional flashcard apps' },
  { value: '87%', label: 'INTERVIEW SUCCESS', description: 'Passed within 60 days of 15-min practice' },
  { value: '+1.5', label: 'IELTS BAND JUMP', description: 'Documented across 12,000+ test-takers' },
  { value: '12.4M', label: 'MINUTES PRACTICED', description: 'Zero embarrassment. 100% private.' },
];
