export type CapabilityCard = {
  icon: string;
  title: string;
  description: string;
  sampleMessage?: string;
  author?: string;
  sound?: string;
  memory?: string;
  indicator?: string;
  tags?: string[];
};

export type LearningMetric = {
  value: string;
  label: string;
};

export const capabilityCards: CapabilityCard[] = [
  { icon: 'heart', title: 'Zero-Judgment Conversational Haven', description: 'No human tutor sighs when you pause or repeat yourself for the fifth time. Emma adjusts her patience level to infinite, encouraging you until the pronunciation clicks.', sampleMessage: '“I finally stopped feeling ashamed of my French accent. I speak 20 mins every morning before work.”', author: 'Claire D. • Paris, France' },
  { icon: 'sound', title: 'Phonetic Accent Tuner', description: 'Isolate difficult sound pairings—such as the English /θ/ vs /s/—with dynamic visual waveform overlays.', sound: 'Sound: "Thorough"', indicator: 'Match: 95%' },
  { icon: 'scenarios', title: '1,200+ Roleplay Scenarios', description: 'From ordering artisan coffee in London to pitching VC partners on Sand Hill Road. Experience every nuance before it counts.', tags: ['Coffee Shop', 'VC Seed Pitch', 'Emergency Room', '+ Custom Prompt'] },
  { icon: 'memory', title: 'Adaptive Persistent Memory', description: 'Emma remembers your stumbling blocks from 3 days ago. If you struggled with "ubiquitous" or prepositions like "in charge of", she will organically prompt them into tomorrow\'s conversation.', memory: 'Active Memory Cache: 30 words reinforced this week', indicator: 'Auto-synced' },
];

export const learningMetrics: LearningMetric[] = [
  { value: '3.4x', label: 'FLUENCY GAINS' },
  { value: '87%', label: 'INTERVIEW SUCCESS' },
  { value: '+1.5', label: 'IELTS BAND JUMP' },
  { value: '12.4M', label: 'MINUTES PRACTICED' },
];
