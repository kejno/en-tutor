import { useId, useState } from 'react';
import { Collapse } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { toggleFaqItem } from '../lib/faqState';

type FaqItem = { id: string; question: string; answer: string };
type FaqProps = { items?: FaqItem[] };

export function Faq({ items = [] }: FaqProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const instanceId = useId();
  if (items.length === 0) return null;

  return (
    <section className="section faq" id="faq" aria-labelledby={`${instanceId}-title`}>
      <p className="eyebrow">Got Questions?</p>
      <h2 id={`${instanceId}-title`}>Frequently Asked Questions</h2>
      <Collapse
        className="faq-list"
        activeKey={openItem ? [openItem] : []}
        items={items.map((item) => {
          const isOpen = openItem === item.id;
          const questionId = `${instanceId}-question-${item.id}`;
          const answerId = `${instanceId}-answer-${item.id}`;
          return {
            key: item.id,
            // Native buttons provide both Enter and Space activation and explicit ARIA links.
            collapsible: 'icon',
            showArrow: false,
            forceRender: true,
            label: (
              <button type="button" id={questionId} aria-controls={answerId}
                aria-expanded={isOpen} className="faq-question"
                onClick={() => setOpenItem(toggleFaqItem(openItem, item.id))}>
                {item.question}<DownOutlined aria-hidden="true" rotate={isOpen ? 180 : 0} />
              </button>
            ),
            children: <div id={answerId} role="region" aria-labelledby={questionId} hidden={!isOpen}><p>{item.answer}</p></div>,
          };
        })}
      />
    </section>
  );
}
