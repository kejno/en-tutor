import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import App from '../src/App';

afterEach(cleanup);

it('renders all four complete, static capability demonstrations', () => {
  render(<App />);
  const section = screen.getByRole('region', { name: 'Everything You Need for Verbal Mastery' });
  expect(section.querySelectorAll('.four-grid > article')).toHaveLength(4);
  const content = within(section);
  expect(content.getByRole('img', { name: 'Claire D.' })).toBeInTheDocument();
  expect(content.getByText('Claire D. • Paris, France')).toBeInTheDocument();
  expect(content.getByText(/I speak 20 mins every morning before work/)).toBeInTheDocument();
  expect(content.getByText(/Sound:.*Thorough/)).toBeInTheDocument();
  expect(content.getByText(/\/θ\/ vs \/s\//)).toBeInTheDocument();
  for (const tag of ['Coffee Shop', 'VC Seed Pitch', 'Emergency Room', '+ Custom Prompt']) {
    expect(content.getByText(tag)).toBeInTheDocument();
  }
  expect(content.getByText('Active Memory Cache: 30 words reinforced this week')).toBeInTheDocument();
  expect(content.getByText('Match: 95%')).toBeInTheDocument();
  expect(content.getByText('Auto-synced')).toBeInTheDocument();
  expect(content.queryByRole('button')).not.toBeInTheDocument();
  expect(content.queryByRole('progressbar')).not.toBeInTheDocument();
});
