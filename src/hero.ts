import { renderAssessmentCard } from './assessment.ts';

export function renderHero(): HTMLElement {
  const hero = document.createElement('main');
  hero.className = 'hero';
  hero.innerHTML = `
    <div class="hero-copy">
      <span class="announcement">✦ FluentAI 3.0 beta <span>Real-time AI Coach &amp; Instant Fluency Feedback</span></span>
      <h1>Speak English with Natural <br><em>Confidence in Just 15 Minutes a Day</em></h1>
      <p class="hero-description">Overcome speaking anxiety with a private, hyper-realistic AI tutor that listens,<br class="desktop-only"> repairs grammar gently in real-time, and tailors every simulated dialogue to your exact career ambitions.</p>
      <div class="hero-actions">
        <button class="button button-primary" data-testid="trial-cta" type="button">Start Free 7-Day Trial <span>→</span></button>
        <a class="button button-secondary" data-testid="demo-link" href="#assessment"><span class="play-icon">▶</span> Watch 2-Min Live Demo</a>
      </div>
      <div class="trust-line"><span>✦ 4.9/5</span><span>48,000+ ambitious learners</span><span>◈ Built for global teams</span></div>
    </div>
    <div class="hero-card-wrap" id="assessment"></div>
    <div class="toast" role="status" aria-live="polite" hidden>Free trial sign-up is coming soon.</div>
  `;
  hero.querySelector('.hero-card-wrap')?.append(renderAssessmentCard());
  hero.querySelector<HTMLButtonElement>('[data-testid="trial-cta"]')?.addEventListener('click', () => {
    const toast = hero.querySelector<HTMLElement>('.toast');
    if (toast) {
      toast.hidden = false;
      window.setTimeout(() => { toast.hidden = true; }, 4000);
    }
  });
  return hero;
}
