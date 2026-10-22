import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import App from '../src/App';

afterEach(cleanup);

it('renders three complete stories with five-star ratings and named portraits', () => {
  render(<App />);
  const section = document.querySelector('#results') as HTMLElement;
  const cards = within(section).getAllByRole('article');
  expect(cards).toHaveLength(3);
  const endings = ['zero anxiety.”', 'made all the difference.”', 'within just 3 days.”'];
  ['Marco S.', 'Aiko T.', 'Carlos M.'].forEach((name, index) => {
    const card = within(cards[index]);
    expect(card.getByRole('img', { name: '5 out of 5 stars' })).toHaveTextContent('★★★★★');
    expect(card.getByRole('img', { name })).toHaveAttribute('src', expect.stringContaining('.png'));
    expect(cards[index].querySelector('p')).toHaveTextContent(endings[index]);
    expect(cards[index].querySelector('small')).not.toBeEmptyDOMElement();
  });
  expect(within(section).getByRole('heading', { level: 2 })).toHaveAttribute('id', 'results-title');
  expect(screen.getAllByRole('link', { name: 'Results & Stories' })[0]).toHaveAttribute('href', '#results');
});
