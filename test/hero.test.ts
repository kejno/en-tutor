import { describe, expect, it } from 'vitest';
import { renderHero } from '../src/hero.ts';

describe('hero', () => {
  it('renders the value proposition and actionable controls', () => {
    const hero = renderHero();

    expect(hero.querySelector('h1')?.textContent).toContain('Speak English with Natural Confidence');
    expect(hero.querySelector('[data-testid="trial-cta"]')).not.toBeNull();
    expect(hero.querySelector('[data-testid="demo-link"]')).not.toBeNull();
    expect(hero.querySelector('[data-testid="assessment-card"]')).not.toBeNull();
  });
});
