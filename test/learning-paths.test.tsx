import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import App from '../src/App';

afterEach(cleanup);

it('shows the business title without a topic prefix and exposes its vocabulary and readiness', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Ace C-Suite Reviews and Executive Phrasing Without Stumbling' })).toBeInTheDocument();
  const section = document.querySelector('#paths') as HTMLElement;
  expect(within(section).getAllByText(/Mastered|In Practice|Queued Today/)).toHaveLength(3);
  expect(within(section).getByText('78%')).toBeInTheDocument();
});

it('switches all related content together and restores business on return', async () => {
  const user = userEvent.setup();
  render(<App />);
  const section = document.querySelector('#paths') as HTMLElement;
  const topics = within(section).getAllByRole('button');
  const cases = [
    [1, 'Build Confident IELTS Answers and Academic Arguments', 'Substantiate a claim', '74%', 'IELTS Speaking Feedback', 'Explaining how your research findings', 'university applicants'],
    [2, 'Keep Natural Conversations Moving with Ease', 'That makes sense', '82%', 'Conversation Confidence Drills', 'Joining a conversation with new friends', 'everyday confidence'],
    [3, 'Handle Travel and Relocation Conversations Smoothly', 'Could you clarify?', '80%', 'Relocation Roleplay Drills', 'Resolving a problem with your apartment lease', 'relocating abroad'],
    [0, 'Ace C-Suite Reviews and Executive Phrasing Without Stumbling', 'Leverage synergies', '78%', 'Tech Metaphor Masterclass', 'Negotiating a 15% salary adjustment', 'Senior Engineers'],
  ] as const;
  for (const [index, title, term, readiness, benefit, scenario, audience] of cases) {
    await user.click(topics[index]);
    expect(within(section).getByRole('heading', { name: title })).toBeInTheDocument();
    expect(within(section).getByText(term)).toBeInTheDocument();
    expect(within(section).getByText(readiness)).toBeInTheDocument();
    expect(within(section).getByText(benefit)).toBeInTheDocument();
    expect(topics.filter(topic => topic.getAttribute('aria-pressed') === 'true')).toEqual([topics[index]]);
    expect(section.querySelector('.roleplay-scenario')).toHaveTextContent(scenario);
    expect(section.querySelector('.recommendation')).toHaveTextContent(audience);
    expect(section.querySelectorAll('.vocabulary-item')).toHaveLength(3);
    expect(section.querySelectorAll('.roleplay-panel li')).toHaveLength(4);
  }
});
