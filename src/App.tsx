import { useState } from 'react';
import { Button, Drawer, Progress, Tag } from 'antd';
import { ArrowRightOutlined, MenuOutlined, PlayCircleOutlined, CheckOutlined } from '@ant-design/icons';

const navigation = [
  { label: 'Methodology', href: '#methodology' },
  { label: 'Personalized Paths', href: '#paths' },
  { label: 'Interactive Demo', href: '#live-coach' },
  { label: 'Results & Stories', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
];

function Brand() {
  return <span className="brand-mark" aria-hidden="true">F</span>;
}

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Primary navigation" className="navigation-links">
      {navigation.map((item) => (
        <a key={item.href} href={item.href} onClick={onNavigate}>{item.label}</a>
      ))}
    </nav>
  );
}

function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <a href="#top" className="brand" aria-label="FluentAI home"><Brand /><span>FluentAI</span></a>
        <div className="desktop-nav"><NavigationLinks /></div>
        <div className="header-actions">
          <a className="login-link" href="#login">Log in</a>
          <Button type="primary" href="#trial" className="trial-button">Start Free Trial</Button>
          <span className="avatar" aria-label="Profile placeholder">FS</span>
          <button className="menu-button" aria-label="Open navigation" onClick={onOpenMenu}><MenuOutlined /></button>
        </div>
      </div>
    </header>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Tag className="section-label">{children}</Tag>;
}

function CoachDemo() {
  return (
    <section id="live-coach" className="coach-section content-section" aria-labelledby="coach-title">
      <div className="coach-header"><SectionLabel>Live Coach</SectionLabel><span className="live-pill">● Live now</span></div>
      <div className="coach-card">
        <div className="chat-panel">
          <div className="chat-top"><span className="mini-avatar">EM</span><div><strong>Emma · AI Native Coach</strong><small>Scenario: Product Leadership & Executive Q&amp;A</small></div><Tag color="blue">Live</Tag></div>
          <div className="coach-message">“Your explanation is clear. Can you make the result more specific?”</div>
          <div className="user-message">“We improved activation by 34% after simplifying the onboarding flow.”</div>
          <div className="feedback-card"><strong>Excellent clarity</strong><span>Try a stronger transition to connect your result to the next idea.</span><div className="progress-line"><i /></div></div>
          <div className="chat-input">Tap or speak your answer <ArrowRightOutlined /></div>
        </div>
        <div className="score-panel"><span className="score-caption">Live Fluency Dial</span><div className="dial"><strong>94%</strong><span>Excellent</span></div><Progress percent={94} showInfo={false} strokeColor="#2f80ed" /><div className="score-row"><span>Pronunciation Clarity</span><b>93%</b></div><div className="score-row"><span>Conversational Flow</span><b>88%</b></div><div className="score-row"><span>Lexical Sophistication</span><b>80%</b></div></div>
      </div>
    </section>
  );
}

const methodCards = [
  ['01', 'Diagnostic Voice Assessment', 'A 3-minute, AI-led analysis of your vocabulary, rhythm, and accent patterns.'],
  ['02', 'Daily 15-Min Micro-Dialogues', 'Engage in low-pressure, highly focused practice built around your real goals.'],
  ['03', 'Surgical Accent Alignment', 'Receive specific, practical adjustments for clarity and natural pacing.'],
];

function Methodology() {
  return <section id="methodology" className="content-section" aria-labelledby="method-title"><div className="center-heading"><SectionLabel>Our Methodology</SectionLabel><h2 id="method-title">The 3-Step <em>Rapid Fluency</em> Method</h2><p>Build intelligent speaking habits that stick, from first conversation to confident communication.</p></div><div className="three-columns">{methodCards.map(([number, title, copy]) => <article className="feature-card" key={number}><span className="number-badge">{number}</span><h3>{title}</h3><p>{copy}</p><small>Results-focused practice <ArrowRightOutlined /></small></article>)}</div></section>;
}

function Paths() {
  return <section id="paths" className="content-section tinted" aria-labelledby="paths-title"><SectionLabel>Targeted Paths</SectionLabel><div className="split-heading"><div><h2 id="paths-title">Tailored to What You Actually Say</h2><p>Don't waste time reciting arbitrary filler. Choose the exact conversation track you need for your career or life mission.</p></div><div className="topic-pills"><Tag>Business &amp; Tech</Tag><Tag>IELTS &amp; Academic Prep</Tag><Tag>Everyday Casual Conversation</Tag><Tag>Relocation &amp; Travel Fluency</Tag></div></div><div className="path-card"><div><Tag color="blue">Advanced Professionals</Tag><h3>Ace C-Suite Reviews and Executive Pitches Without Stumbling</h3><p>Simulate high-pressure boardroom interactions, clarify complex positions, and speak with authority.</p><div className="path-features"><span><CheckOutlined /> C-Suite Phrasing</span><span><CheckOutlined /> Real-time Tone Polisher</span><span><CheckOutlined /> Improv Pitch Drills</span><span><CheckOutlined /> Tech Investor Masterclass</span></div></div><aside><strong>Target Vocabulary Focus</strong><span>Leverage &amp; strategic narrative</span><Progress percent={76} showInfo={false} strokeColor="#2f80ed" /><span>Executive Track Readiness</span></aside></div></section>;
}

function Results() {
  return <section id="results" className="content-section" aria-labelledby="results-title"><div className="center-heading"><SectionLabel>Proven Progress</SectionLabel><h2 id="results-title">Everything You Need for Verbal Mastery</h2><p>AI-powered coaching that turns awkward pauses into natural, confident conversation.</p></div><div className="results-grid">{['Zero-Judgment Conversational Haven', 'Phonetic Accent Tuner', '1,200+ Roleplay Scenarios', 'Adaptive Persistent Memory'].map((title, index) => <article className="result-card" key={title}><span className="result-icon">{['⌁', '✦', '↗', '▣'][index]}</span><h3>{title}</h3><p>{['Practice speaking freely without fear of judgment, with realistic feedback that helps you improve.', 'Visualize difficult sounds and receive personalized cues for natural pronunciation.', 'From interviews to travel, choose a realistic roleplay and practise until it feels easy.', 'FluentAI remembers your progress, goals, and preferred coaching style.'][index]}</p></article>)}</div><div className="stats"><div><b>3.4x</b><span>Faster than traditional classrooms</span></div><div><b>87%</b><span>Increased speaking confidence</span></div><div><b>+1.5</b><span>Band score improvement</span></div><div><b>12.4M</b><span>Words practiced</span></div></div></section>;
}

function Pricing() {
  const plans = [['Starter', '$14', 'Perfect for casual learners building daily habits.'], ['Pro Fluency', '$24', 'For professionals, expats, and exam candidates.'], ['Executive 1-on-1 AI', '$49', 'For leaders who demand premium, focused results.']];
  return <section id="pricing" className="pricing-section content-section tinted" aria-labelledby="pricing-title"><div className="center-heading"><SectionLabel>Simple Plans</SectionLabel><h2 id="pricing-title">Invest in Your Verbal Future</h2><p>Less than the price of a single private tutor session per month.</p></div><div className="pricing-grid">{plans.map(([name, price, description], index) => <article className={`price-card ${index === 1 ? 'featured' : ''}`} key={name}>{index === 1 && <Tag color="blue">Most Popular</Tag>}<h3>{name}</h3><p>{description}</p><div className="price">{price}<small>/month</small></div><ul><li><CheckOutlined /> 15 min daily voice conversation</li><li><CheckOutlined /> Standard grammar correction</li><li><CheckOutlined /> 250+ roleplay scenarios</li></ul><Button type={index === 1 ? 'primary' : 'default'} block href="#trial">Start Free 7-Day Trial</Button></article>)}</div></section>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div id="top"><Header onOpenMenu={() => setMenuOpen(true)} /><Drawer title={<a href="#top" className="brand" onClick={() => setMenuOpen(false)}><Brand /><span>FluentAI</span></a>} placement="right" open={menuOpen} onClose={() => setMenuOpen(false)} width={280}><NavigationLinks onNavigate={() => setMenuOpen(false)} /><Button type="primary" block href="#trial" onClick={() => setMenuOpen(false)}>Start Free Trial</Button></Drawer><main><section className="hero content-section" aria-labelledby="hero-title"><div className="hero-copy"><SectionLabel>FluentAI 3.0 · Real-time AI Coach &amp; Instant Fluency Feedback</SectionLabel><h1 id="hero-title">Speak English with Natural <span>Confidence in Just 15 Minutes a Day</span></h1><p>Overcome speaking anxiety with a private, hyper-realistic AI tutor that listens, repairs grammar gently in real-time, and tailors every simulated dialogue to your exact career ambitions.</p><div className="hero-actions"><Button type="primary" size="large" href="#trial">Start Free 7-Day Trial <ArrowRightOutlined /></Button><Button size="large" href="#live-coach" icon={<PlayCircleOutlined />}>Watch 2-Min Live Demo</Button></div><small>★★★★★ 4.9/5 · 40,000+ students worldwide · <Tag color="gold">7-day refund promise</Tag></small></div><CoachDemo /></section><section className="trust-bar"><small>TRUSTED BY AMBITIOUS PROFESSIONALS &amp; GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE</small><div><span>Google</span><span>Spotify</span><span>McKinsey</span><span>Stanford</span><span>Uber</span><span>Revolut</span></div></section><Methodology /><Paths /><Results /><Pricing /><section id="trial" className="trial-section"><SectionLabel>Unlock Global Opportunities</SectionLabel><h2>Your Next Career Milestone Requires Fluent English.</h2><p>Start speaking out loud today without performance anxiety. Your private AI tutor is ready when you are.</p><Button type="primary" size="large">Claim 7 Days Free</Button></section></main><footer><a href="#top" className="brand"><Brand /><span>FluentAI</span></a><small>© 2025 FluentAI Technologies Inc. All rights reserved.</small></footer></div>;
}

export default App;
