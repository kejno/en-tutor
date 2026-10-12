import './style.css';
import { getPriceView, type BillingPeriod } from './pricing';

const testimonials = [
  {
    tag: 'CEFR: B1 ➔ C1 Level',
    quote: 'FluentAI cured my imposter syndrome before standups. I went from hesitant one-word answers to leading multi-team architecture sprint reviews at our Berlin office with zero anxiety.',
    name: 'Marco S.',
    role: 'Senior Tech Lead • Berlin Hub',
  },
  {
    tag: 'IELTS 6.5 ➔ Band 8.5',
    quote: 'The IELTS examiner simulator gave me exact Band 8.0 predictions before my official exam. Scored an overall 8.5 last weekend! The instant feedback on transition words made all the difference.',
    name: 'Aiko T.',
    role: 'Medical Researcher • Tokyo',
  },
  {
    tag: 'Promoted to VP',
    quote: 'Like having an Oxford linguistics professor in your pocket available at 11 PM after work. It caught every recurring habit I had with irregular verbs within just 3 days.',
    name: 'Carlos M.',
    role: 'Marketing Director • Madrid',
  },
];

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 14,
    description: 'Perfect for casual learners building daily habits.',
    features: ['15 mins daily voice conversation', 'Standard grammar correction', '100+ basic roleplay scenarios'],
  },
  {
    id: 'pro',
    name: 'Pro Fluency',
    price: 24,
    description: 'For professionals, expats, and exam candidates.',
    features: ['Everything in Pro Fluency', 'Monthly human linguist accent audit', 'IELTS Speaking Examiner Simulator', 'Phonetic accent waveforms'],
    popular: true,
  },
  {
    id: 'executive',
    name: 'Executive 1-on-1 AI+',
    price: 49,
    description: 'For founders, diplomats, and senior executives.',
    features: ['Unlimited voice conversation minutes', 'Phonetic Accent Tuner & Mouth Shapes', 'Custom corporate scenarios uploaded', 'Executive & Tech Business tracks', 'VIP Priority Voice Infrastructure'],
  },
];

function renderTestimonials(): string {
  return testimonials.map((testimonial) => `
    <article class="testimonial-card">
      <span class="tag">${testimonial.tag}</span>
      <div class="stars" aria-label="5 out of 5 stars">★★★★★</div>
      <blockquote>“${testimonial.quote}”</blockquote>
      <footer>
        <span class="avatar" aria-hidden="true">${testimonial.name.charAt(0)}</span>
        <span><strong>${testimonial.name}</strong><small>${testimonial.role}</small></span>
      </footer>
    </article>`).join('');
}

function renderPlans(period: BillingPeriod): string {
  return plans.map((plan) => {
    const price = getPriceView(plan.price, period);
    return `
      <article class="plan-card${plan.popular ? ' popular' : ''}" data-plan="${plan.id}">
        ${plan.popular ? '<span class="popular-badge">Most Popular Choice</span>' : ''}
        <h3>${plan.name}</h3>
        <p class="plan-description">${plan.description}</p>
        <div class="price"><span class="price-value" data-price="${plan.id}">${price.monthly}</span><span class="price-period">/ месяц</span></div>
        <p class="billing" data-billing="${plan.id}">${price.billing}</p>
        <ul>${plan.features.map((feature) => `<li>${feature}</li>`).join('')}</ul>
        <button class="cta" type="button">Start Free 7-Day Trial</button>
      </article>`;
  }).join('');
}

function renderApp(): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <header class="site-header">
      <a class="brand" href="#top" aria-label="FluentAI home"><span class="brand-mark">✦</span> FluentAI</a>
      <nav aria-label="Main navigation"><a href="#stories">Results & Stories</a><a href="#pricing">Pricing</a></nav>
      <div class="header-actions"><a href="#pricing">Log in</a><a class="button small" href="#pricing">Start Free Trial</a></div>
    </header>
    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <span class="eyebrow">FluentAI 3.0 Live · Real-time Accent Coach & Instant Fluency Feedback</span>
        <h1 id="hero-title">Speak English with Natural<br><span>Confidence in Just 15 Minutes a Day</span></h1>
        <p>Overcome speaking anxiety with a private, hyper-realistic AI tutor that listens,<br>repairs grammar gently in real-time, and tailors every simulated dialogue to your exact career ambitions.</p>
        <a class="button" href="#pricing">Start Free 7-Day Trial <span aria-hidden="true">→</span></a>
      </section>
      <section class="proof section" id="stories" aria-labelledby="stories-title">
        <span class="eyebrow">Learner Proof</span>
        <h2 id="stories-title">Real Transformations, Real Careers</h2>
        <p class="section-intro">Hear how ambitious professionals shifted from hesitating mid-sentence to commanding meetings.</p>
        <div class="testimonial-grid">${renderTestimonials()}</div>
      </section>
      <section class="pricing section" id="pricing" aria-labelledby="pricing-title">
        <span class="eyebrow">Simple Plans</span>
        <h2 id="pricing-title">Invest in Your Verbal Future</h2>
        <p class="section-intro">Less than the price of a single private tutor session per month. Full speech science stack included.</p>
        <fieldset class="billing-switch">
          <legend class="sr-only">Billing period</legend>
          <label><input type="radio" name="billing" value="monthly"><span>Billed Monthly</span></label>
          <label class="annual-option"><input type="radio" name="billing" value="annual" checked><span>Billed Annually</span><b>Save 40%</b></label>
        </fieldset>
        <div class="plans-grid" aria-live="polite">${renderPlans('annual')}</div>
        <p class="guarantee">◎ 30-Day Unconditional Fluency Guarantee: If your confidence does not dramatically expand, request a full refund with 1-click.</p>
      </section>
    </main>
    <footer class="site-footer"><span>© 2025 FluentAI Technologies Inc.</span><a href="#top">Privacy Policy</a><a href="#top">Terms of Service</a></footer>`;

  document.querySelectorAll<HTMLInputElement>('input[name="billing"]').forEach((input) => {
    input.addEventListener('change', () => {
      const period = input.value as BillingPeriod;
      document.querySelector<HTMLDivElement>('.plans-grid')!.innerHTML = renderPlans(period);
    });
  });
}

renderApp();
