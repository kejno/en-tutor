import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import App from '../src/App';

afterEach(cleanup);

it('renders the reference institutions as static text between hero and methodology', () => {
  render(<App />);
  const strip = screen.getByRole('region', { name: 'TRUSTED BY AMBITIOUS PROFESSIONALS & GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE' });
  expect(within(strip).getByText('TRUSTED BY AMBITIOUS PROFESSIONALS & GRADUATE STUDENTS FROM LEADING INSTITUTIONS WORLDWIDE')).toBeInTheDocument();
  expect(Array.from(strip.querySelectorAll('b'), item => item.textContent)).toEqual(['Google', 'Spotify', 'McKinsey', 'Stanford', 'Uber', 'Revolut']);
  expect(strip.querySelectorAll('a, button, input')).toHaveLength(0);
  expect(strip.previousElementSibling).toHaveClass('hero');
  expect(strip.nextElementSibling).toHaveAttribute('id', 'methodology');
});
