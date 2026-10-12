export type FaqItemId = string | null;

export function toggleFaqItem(openItem: FaqItemId, nextItem: string): FaqItemId {
  return openItem === nextItem ? null : nextItem;
}
