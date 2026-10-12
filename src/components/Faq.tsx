import { useState } from 'react';
import { toggleFaqItem } from '../lib/faqState';

type FaqItem = { id: string; question: string; answer: string };

type FaqProps = { items?: FaqItem[] };

export function Faq({ items = [] }: FaqProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="section faq" id="faq" aria-labelledby="faq-title">
      <p className="eyebrow">Got Questions?</p>
      <h2 id="faq-title">Frequently Asked Questions</h2>
      <div className="faq-list">
        {items.map((item) => {
          const isOpen = openItem === item.id;
          return (
            <div className="faq-item" key={item.id}>
              <button
                aria-controls={`faq-answer-${item.id}`}
                aria-expanded={isOpen}
                className="faq-question"
                onClick={() => setOpenItem(toggleFaqItem(openItem, item.id))}
              >
                {item.question}<span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              <div id={`faq-answer-${item.id}`} hidden={!isOpen}>
                <p>{item.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
