import { useEffect, useRef, useState } from 'react';
import { Button, ConfigProvider, Progress } from 'antd';
import { EmailCapture } from './components/EmailCapture';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { renderAssessmentCard } from './assessment';
import { capabilityCards, learningMetrics } from './capabilities';
import { learningTopics, methodologySteps } from './methodology';
import { getPriceView, type BillingPeriod } from './pricing';
import './styles.css';

const plans = [
  { id: 'starter', name: 'Starter', price: 14, description: 'Perfect for casual learners building daily habits.', features: ['15 mins daily voice conversation', 'Standard grammar correction', '100+ basic roleplay scenarios'] },
  { id: 'pro', name: 'Pro Fluency', price: 24, description: 'For professionals, expats, and exam candidates.', features: ['Unlimited voice conversation minutes', 'Phonetic Accent Tuner & Mouth Shapes', 'IELTS Speaking Examiner Simulator', 'Executive & Tech Business tracks'], featured: true },
  { id: 'executive', name: 'Executive 1-on-1 AI+', price: 49, description: 'For founders, diplomats, and senior executives.', features: ['Everything in Pro Fluency', 'Monthly human linguist accent audit', 'Custom corporate scenarios uploaded'] },
];

const faqItems = [
  {
    id: 'trial',
    question: 'How does the 7-day free trial work?',
    answer: 'The landing page offers a 7-day free trial. The form only shows a local confirmation because no server API is connected.',
  },
  {
    id: 'level',
    question: 'What English level do I need before starting?',
    answer: 'No level is specified as a prerequisite on this landing page. Choose a track that matches your goals and start with the available speaking practice.',
  },
  {
    id: 'accent',
    question: 'Will FluentAI help me eliminate my native accent completely?',
    answer: 'FluentAI provides accent feedback and pronunciation practice. It does not promise to eliminate a native accent completely.',
  },
];

type TopicCard = {
  label: string;
  recommendation: string;
  title: string;
  description: string;
  scenario: string;
  benefits: string[];
  vocabulary: Array<{ term: string; description: string; status: string }>;
  readinessLabel: string;
  readiness: number;
};

const topicCards: Record<string, TopicCard> = {
  business: {
    label: '💼 Business & Tech Pitching',
    recommendation: 'Recommended for Senior Engineers, PMs, and Consultants',
    title: 'Ace C-Suite Reviews and Executive Phrasing Without Stumbling',
    description: 'Simulate high-pressure boardroom interactions. Practice diplomacy, conflict resolution, active pushback, and crisp technical storytelling.',
    scenario: '"Negotiating a 15% salary adjustment with your Vice President after exceeding quarterly KPI metrics."',
    benefits: ['C-Suite Phrasing Vault', 'Real-time Tone Polisher', 'Impromptu Pitch Drills', 'Tech Metaphor Masterclass'],
    vocabulary: [
      { term: 'Leverage synergies', description: 'Executive alternative to "work together"', status: 'Mastered' },
      { term: 'Streamline overhead', description: 'Alternative to "make cost cheaper"', status: 'In Practice' },
      { term: 'Paradigm shift', description: 'Express fundamental structural evolution', status: 'Queued Today' },
    ],
    readinessLabel: 'Executive Track Readiness',
    readiness: 78,
  },
  academic: {
    label: '🎓 IELTS & Academic Prep',
    recommendation: 'Recommended for university applicants and graduate students',
    title: 'Build Confident IELTS Answers and Academic Arguments',
    description: 'Practice structured speaking responses, precise explanations, and evidence-based arguments for high-stakes academic conversations.',
    scenario: '"Explaining how your research findings address a challenge in your chosen field during an IELTS speaking interview."',
    benefits: ['Structured Response Framework', 'Academic Vocabulary Builder', 'Evidence-Based Argument Drills', 'IELTS Speaking Feedback'],
    vocabulary: [
      { term: 'Substantiate a claim', description: 'Support an argument with evidence', status: 'Mastered' },
      { term: 'Nuanced perspective', description: 'Show a balanced academic viewpoint', status: 'In Practice' },
      { term: 'Consequently', description: 'Connect evidence to an outcome', status: 'Queued Today' },
    ],
    readinessLabel: 'IELTS Speaking Readiness',
    readiness: 74,
  },
  everyday: {
    label: '🌍 Everyday Casual Conversation',
    recommendation: 'Recommended for learners building everyday confidence',
    title: 'Keep Natural Conversations Moving with Ease',
    description: 'Practice small talk, follow-up questions, and clear everyday responses for comfortable conversations with people around the world.',
    scenario: '"Joining a conversation with new friends at a local community event and finding common ground."',
    benefits: ['Small Talk Starters', 'Natural Follow-up Questions', 'Everyday Tone Coach', 'Conversation Confidence Drills'],
    vocabulary: [
      { term: 'That makes sense', description: 'A natural way to show understanding', status: 'Mastered' },
      { term: 'Speaking of which', description: 'Smoothly introduce a related idea', status: 'In Practice' },
      { term: 'I see what you mean', description: 'Acknowledge another perspective', status: 'Queued Today' },
    ],
    readinessLabel: 'Conversation Readiness',
    readiness: 82,
  },
  travel: {
    label: '✈️ Relocation & Travel Fluency',
    recommendation: 'Recommended for travelers and people relocating abroad',
    title: 'Handle Travel and Relocation Conversations Smoothly',
    description: 'Rehearse practical conversations for airports, housing, services, and meeting people while settling into a new place.',
    scenario: '"Resolving a problem with your apartment lease after arriving in a new country."',
    benefits: ['Travel Problem-Solving Phrases', 'Housing Conversation Practice', 'Polite Request Builder', 'Relocation Roleplay Drills'],
    vocabulary: [
      { term: 'Could you clarify?', description: 'Ask for details politely', status: 'Mastered' },
      { term: 'I am looking for', description: 'Explain what you need clearly', status: 'In Practice' },
      { term: 'Would it be possible?', description: 'Make a respectful request', status: 'Queued Today' },
    ],
    readinessLabel: 'Relocation Readiness',
    readiness: 80,
  },
};

function AssessmentPreview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const card = renderAssessmentCard();
    container.replaceChildren(card);

    return () => card.remove();
  }, []);

  return <div ref={containerRef} aria-label="Emma speech assessment" />;
}

function App() {
  const [billing, setBilling] = useState<BillingPeriod>('annual');
  const [activatedPlan, setActivatedPlan] = useState<string | null>(null);
  const [trialNotice, setTrialNotice] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('business');
  const topicCard = topicCards[selectedTopic] ?? topicCards.business;

  const showTrialNotice = () => setTrialNotice(true);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#347cff', borderRadius: 5, fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' } }}>
      <div id="top">
      <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">✦</span> FluentAI</a><nav aria-label="Primary navigation"><a href="#methodology">Methodology</a><a href="#paths">Personalized Paths</a><a href="#live-coach">Interactive Demo</a><a href="#results">Results &amp; Stories</a><a href="#pricing">Pricing</a></nav><details className="mobile-navigation"><summary aria-label="Open navigation">☰</summary><nav aria-label="Mobile primary navigation" className="mobile-navigation-links"><a href="#methodology">Methodology</a><a href="#paths">Personalized Paths</a><a href="#live-coach">Interactive Demo</a><a href="#results">Results &amp; Stories</a><a href="#pricing">Pricing</a></nav></details><div className="header-actions"><a href="#final-cta">Log in</a><Button className="button small" data-testid="header-trial" type="primary" onClick={showTrialNotice}>Start Free Trial</Button><span className="avatar">A</span></div></header>
      {trialNotice && <div className="sr-only" role="status">Пробный период скоро будет доступен</div>}
      <main>
        <section className="hero section"><div className="hero-copy"><p className="eyebrow">FluentAI 3.0 Live <span>Real-time Accent Coach &amp; Instant Fluency Feedback</span></p><h1>Speak English with Natural <em>Confidence in Just 15 Minutes a Day</em></h1><p>Overcome speaking anxiety with a private, hyper-realistic AI tutor that listens, repairs grammar gently in real-time, and tailors every simulated dialogue to your exact career ambitions.</p><div className="hero-actions"><Button aria-label="Start trial from hero" className="button" data-testid="trial-cta" type="primary" onClick={showTrialNotice}>Start Free 7-Day Trial ↗</Button><a className="button secondary" href="#live-coach">◉ Watch 2-Min Live Demo</a></div><div className="trust-line"><strong>4.9/5</strong> <span>•</span> 48,000+ active learners across 110 countries <span>•</span> #1 EdTech Product Hunt</div></div><section id="live-coach" aria-labelledby="coach-title"><h2 id="coach-title" className="sr-only">Live Coach</h2><AssessmentPreview /></section></section>
        <section className="logo-strip"><p>TRUSTED BY AMBITIOUS PROFESSIONALS &amp; GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE</p><div><b>Google</b><b>Spotify</b><b>McKinsey</b><b>Stanford</b><b>Uber</b><b>Revolut</b></div></section>
        <section className="section" id="methodology"><div className="section-heading"><p className="eyebrow">Neuro-Linguistic Engine</p><h2>The 3-Step Rapid Fluency Method</h2><p>Built without intimidating multiple-choice drills. You speak out loud from minute one with progressive cognitive difficulty.</p></div><div className="three-col">{methodologySteps.map((step) => <article className="feature-card" key={step.number}><span className="number">{step.number}</span><h3>{step.title}</h3><p>{step.description}</p><small>{step.metricLabel} <strong>{step.metricValue}</strong></small></article>)}</div></section>
        <section className="section muted" id="paths"><div className="paths-heading"><div><p className="eyebrow">Targeted Tracks</p><h2>Tailored to What You Actually Say</h2></div><p>Don't waste time reciting arbitrary fruit names. Choose the exact conversational track you need for your career or life milestone.</p></div><div className="pill-row" role="group" aria-label="Learning topics">{learningTopics.map((topic) => <button type="button" className={`topic-tag ${selectedTopic === topic.id ? 'active' : ''}`} aria-pressed={selectedTopic === topic.id} data-testid="topic-tag" key={topic.id} onClick={() => setSelectedTopic(topic.id)}>{topic.label}</button>)}</div><div className="split-card"><div className="roleplay-panel"><small>{topicCard.recommendation}</small><h3>{topicCard.label}: {topicCard.title}</h3><p>{topicCard.description}</p><div className="roleplay-scenario"><small>ACTIVE ROLEPLAY SCENARIO</small><p>{topicCard.scenario}</p></div><ul>{topicCard.benefits.map((benefit) => <li key={benefit}>✓ {benefit}</li>)}</ul></div><div className="progress-panel"><div className="progress-header"><span>Target Vocabulary Focus</span><small>Module 4 of 12</small></div>{topicCard.vocabulary.map((item) => <div className="vocabulary-item" key={item.term}><span><b>{item.term}</b><small>{item.description}</small></span><em>{item.status}</em></div>)}<div className="readiness"><span>{topicCard.readinessLabel}</span><strong>{topicCard.readiness}%</strong></div><Progress percent={topicCard.readiness} showInfo={false} /></div></div></section>
        <section className="section" aria-labelledby="capabilities-title" aria-label="Verbal mastery capabilities"><div className="section-heading"><p className="eyebrow">Engineered For Ease</p><h2 id="capabilities-title">Everything You Need for Verbal Mastery</h2><p>Built around speech science, eliminating the friction that keeps learners trapped in passive grammar study.</p></div><div className="four-grid">{capabilityCards.map((card) => <article key={card.title}><span className="icon" aria-hidden="true">{card.icon}</span><h3>{card.title}</h3><p>{card.description}</p>{card.sampleMessage && <blockquote>{card.sampleMessage}</blockquote>}{card.miniGraph && <div className="mini-graph" aria-label="Accent matching waveform"><svg viewBox="0 0 68 22" role="img" aria-hidden="true"><path d={card.miniGraph} /></svg></div>}{card.tags && <div className="capability-tags">{card.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}{card.indicator && <strong>{card.indicator}</strong>}</article>)}</div></section>
        <section className="stats" aria-label="Learning metrics">{learningMetrics.map((metric) => <div key={metric.label}><b>{metric.value}</b><span>{metric.label}</span></div>)}</section>
        <section className="section" id="results"><div className="section-heading"><p className="eyebrow">Learner Proof</p><h2>Real Transformations, Real Careers</h2><p>Hear how ambitious professionals shifted from hesitating mid-sentence to commanding meetings.</p></div><div className="three-col testimonials"><article><b>CEFR: B1 ➔ C1 Level</b><p>“FluentAI cured my imposter syndrome before standups. I went from hesitant one-word answers to leading multi-team architecture sprint reviews.”</p><strong>Marco S.</strong><small>Senior Tech Lead · Berlin Hub</small></article><article><b>IELTS 6.5 ➔ Band 8.5</b><p>“The IELTS examiner simulator gave me exact Band 8.0 predictions before my official exam. Scored an overall 8.5!”</p><strong>Aiko T.</strong><small>Medical Researcher · Tokyo</small></article><article><b>Promoted to VP</b><p>“Like having an Oxford linguistics professor in your pocket available at 11 PM after work.”</p><strong>Carlos M.</strong><small>Marketing Director · Madrid</small></article></div></section>
        <section className="section pricing" id="pricing"><div className="section-heading"><p className="eyebrow">Simple Plans</p><h2>Invest in Your Verbal Future</h2><p>Less than the price of a single private tutor session per month.</p><div className="billing"><Button type="text" className={billing === 'monthly' ? 'active' : ''} aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>Billed Monthly</Button><Button type="text" className={billing === 'annual' ? 'active' : ''} aria-pressed={billing === 'annual'} onClick={() => setBilling('annual')}>Billed Annually <mark>Save 40%</mark></Button></div></div><div className="three-col">{plans.map((plan) => { const price = getPriceView(plan.price, billing); return <article className={`plan ${plan.featured ? 'featured' : ''}`} data-plan={plan.id} key={plan.name}>{plan.featured && <span className="popular">Most Popular Choice</span>}<h3>{plan.name}</h3><p>{plan.description}</p><strong className="price"><span className="price-value">{price.monthly}</span><small>/ month</small></strong><p className="billing" data-billing={plan.id}>{price.billing}</p><ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><Button className="button cta" type="primary" onClick={() => setActivatedPlan(plan.id)}>Start Free 7-Day Trial</Button><p className="cta-status" aria-live="polite">{activatedPlan === plan.id ? 'Trial started locally.' : ''}</p></article>; })}</div><p className="guarantee">◉ 30-Day Unconditional Fluency Guarantee: If your confidence does not dramatically expand, request a full refund.</p></section>
        <Faq items={faqItems} />
        <section className="final-cta" id="final-cta" aria-labelledby="final-cta-title"><div className="final-cta-card"><div className="section-heading"><p className="eyebrow">Unlock Global Opportunities</p><h2 id="final-cta-title">Your Next Career Milestone Requires Fluent English.</h2><p>Start speaking out loud today without performance anxiety. Your private AI tutor is ready when you are.</p><EmailCapture /><p className="trial-details">No credit card required upfront • Setup takes 90 seconds</p></div></div></section>
      </main><Footer />
      </div>
    </ConfigProvider>
  );
}

export default App;
