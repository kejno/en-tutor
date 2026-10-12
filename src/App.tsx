import { useEffect, useRef, useState } from 'react';
import { EmailCapture } from './components/EmailCapture';
import { Faq } from './components/Faq';
import { Footer } from './components/Footer';
import { renderAssessmentCard } from './assessment';
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

  const showTrialNotice = () => setTrialNotice(true);

  return (
    <div id="top">
      <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">✦</span> FluentAI</a><nav><a href="#methodology">Methodology</a><a href="#paths">Personalized Paths</a><a href="#results">Results &amp; Stories</a><a href="#pricing">Pricing</a></nav><div className="header-actions"><a href="#final-cta">Log in</a><button className="button small" data-testid="header-trial" type="button" onClick={showTrialNotice}>Start Free Trial</button><span className="avatar">A</span></div></header>
      {trialNotice && <div className="sr-only" role="status">Пробный период скоро будет доступен</div>}
      <main>
        <section className="hero section"><div className="hero-copy"><p className="eyebrow">FluentAI 3.0 Live <span>Real-time Accent Coach &amp; Instant Fluency Feedback</span></p><h1>Speak English with Natural <em>Confidence in Just 15 Minutes a Day</em></h1><p>Overcome speaking anxiety with a private, hyper-realistic AI tutor that listens, repairs grammar gently in real-time, and tailors every simulated dialogue to your exact career ambitions.</p><div className="hero-actions"><button aria-label="Start trial from hero" className="button" data-testid="trial-cta" type="button" onClick={showTrialNotice}>Start Free 7-Day Trial ↗</button><a className="button secondary" href="#methodology">◉ Watch 2-Min Live Demo</a></div><div className="trust-line"><strong>4.9/5</strong> <span>•</span> 48,000+ active learners across 110 countries <span>•</span> #1 EdTech Product Hunt</div></div><AssessmentPreview /></section>
        <section className="logo-strip"><p>TRUSTED BY AMBITIOUS PROFESSIONALS &amp; GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE</p><div><b>Google</b><b>Spotify</b><b>McKinsey</b><b>Stanford</b><b>Uber</b><b>Revolut</b></div></section>
        <section className="section" id="methodology"><div className="section-heading"><p className="eyebrow">Neuro-Linguistic Engine</p><h2>The 3-Step Rapid Fluency Method</h2><p>Built without intimidating multiple-choice drills. You speak out loud from minute one with progressive cognitive difficulty.</p></div><div className="three-col">{[['01', 'Diagnostic Voice Assessment', 'In 3 minutes, our AI analyzes your active vocabulary breadth, accent phoneme stress, and cadence pauses.'], ['02', 'Daily 15-Min Micro-Dialogues', 'Engage in low-pressure, lifelike spoken interactions tailored to your world.'], ['03', 'Surgical Accent Alignment', 'Receive live tongue and palate placement schematics for tricky vowel pairs.']].map(([number, title, text]) => <article className="feature-card" key={number}><span className="number">{number}</span><h3>{title}</h3><p>{text}</p><small>Acoustic Precision · Real-Time Feedback</small></article>)}</div></section>
        <section className="section muted" id="paths"><div className="section-heading"><p className="eyebrow">Targeted Tracks</p><h2>Tailored to What You Actually Say</h2><p>Choose the exact conversational track you need for your career or life milestone.</p></div><div className="pill-row"><span>💼 Business &amp; Tech Pitching</span><span>🎓 IELTS &amp; Academic Prep</span><span>🌍 Everyday Casual Conversation</span><span>✈️ Relocation &amp; Travel Fluency</span></div><div className="split-card"><div><small>Recommended for Senior Engineers, PMs, and Consultants</small><h3>Ace C-Suite Reviews and Executive Phrasing Without Stumbling</h3><p>Simulate high-pressure boardroom interactions. Practice diplomacy, conflict resolution, active pushback, and crisp technical storytelling.</p><ul><li>C-Suite Phrasing Vault</li><li>Real-time Tone Polisher</li><li>Impromptu Pitch Drills</li></ul></div><div className="progress-panel"><span>Executive Track Readiness</span><strong>78%</strong><div className="progress"><i /></div></div></div></section>
        <section className="section"><div className="section-heading"><p className="eyebrow">Engineered For Ease</p><h2>Everything You Need for Verbal Mastery</h2><p>Built around speech science, eliminating the friction that keeps learners trapped in passive grammar study.</p></div><div className="four-grid"><article><span className="icon">♡</span><h3>Zero-Judgment Conversational Haven</h3><p>No human tutor sighs when you pause or repeat yourself for the fifth time. Emma adjusts her patience level to infinite.</p><blockquote>“I finally stopped feeling ashamed of my French accent.”</blockquote></article><article><span className="icon">∿</span><h3>Phonetic Accent Tuner</h3><p>Isolate difficult sound pairings with dynamic visual waveform overlays.</p><strong>Match: 95%</strong></article><article><span className="icon">↗</span><h3>1,200+ Roleplay Scenarios</h3><p>Experience every nuance before it counts, from artisan coffee to VC pitches.</p></article><article><span className="icon">▣</span><h3>Adaptive Persistent Memory</h3><p>Emma remembers your stumbling blocks and organically prompts them into tomorrow’s conversation.</p><strong>Auto-synced</strong></article></div></section>
        <section className="stats"><div><b>3.4x</b><span>FLUENCY GAINS</span></div><div><b>87%</b><span>INTERVIEW SUCCESS</span></div><div><b>+1.5</b><span>IELTS BAND JUMP</span></div><div><b>12.4M</b><span>MINUTES PRACTICED</span></div></section>
        <section className="section" id="results"><div className="section-heading"><p className="eyebrow">Learner Proof</p><h2>Real Transformations, Real Careers</h2><p>Hear how ambitious professionals shifted from hesitating mid-sentence to commanding meetings.</p></div><div className="three-col testimonials"><article><b>CEFR: B1 ➔ C1 Level</b><p>“FluentAI cured my imposter syndrome before standups. I went from hesitant one-word answers to leading multi-team architecture sprint reviews.”</p><strong>Marco S.</strong><small>Senior Tech Lead · Berlin Hub</small></article><article><b>IELTS 6.5 ➔ Band 8.5</b><p>“The IELTS examiner simulator gave me exact Band 8.0 predictions before my official exam. Scored an overall 8.5!”</p><strong>Aiko T.</strong><small>Medical Researcher · Tokyo</small></article><article><b>Promoted to VP</b><p>“Like having an Oxford linguistics professor in your pocket available at 11 PM after work.”</p><strong>Carlos M.</strong><small>Marketing Director · Madrid</small></article></div></section>
        <section className="section pricing" id="pricing"><div className="section-heading"><p className="eyebrow">Simple Plans</p><h2>Invest in Your Verbal Future</h2><p>Less than the price of a single private tutor session per month.</p><div className="billing"><button type="button" className={billing === 'monthly' ? 'active' : ''} aria-pressed={billing === 'monthly'} onClick={() => setBilling('monthly')}>Billed Monthly</button><button type="button" className={billing === 'annual' ? 'active' : ''} aria-pressed={billing === 'annual'} onClick={() => setBilling('annual')}>Billed Annually <mark>Save 40%</mark></button></div></div><div className="three-col">{plans.map((plan) => { const price = getPriceView(plan.price, billing); return <article className={`plan ${plan.featured ? 'featured' : ''}`} data-plan={plan.id} key={plan.name}>{plan.featured && <span className="popular">Most Popular Choice</span>}<h3>{plan.name}</h3><p>{plan.description}</p><strong className="price"><span className="price-value">{price.monthly}</span><small>/ month</small></strong><p className="billing" data-billing={plan.id}>{price.billing}</p><ul>{plan.features.map((feature) => <li key={feature}>✓ {feature}</li>)}</ul><button className="button cta" type="button" onClick={() => setActivatedPlan(plan.id)}>Start Free 7-Day Trial</button><p className="cta-status" aria-live="polite">{activatedPlan === plan.id ? 'Trial started locally.' : ''}</p></article>; })}</div><p className="guarantee">◉ 30-Day Unconditional Fluency Guarantee: If your confidence does not dramatically expand, request a full refund.</p></section>
        <Faq items={faqItems} />
        <section className="final-cta section" id="final-cta"><div className="section-heading"><p className="eyebrow">Unlock Global Opportunities</p><h2>Your Next Career Milestone Requires Fluent English.</h2><p>Start speaking out loud today without performance anxiety. Your private AI tutor is ready when you are.</p><EmailCapture /></div></section>
      </main><Footer />
    </div>
  );
}

export default App;
