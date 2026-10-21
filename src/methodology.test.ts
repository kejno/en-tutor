import { describe, expect, it } from 'vitest';
import { learningTopics, methodologySteps } from './methodology';

describe('methodology content', () => {
  it('publishes three ordered method steps with outcome metrics', () => {
    expect(methodologySteps).toHaveLength(3);
    expect(methodologySteps.map(({ number }) => number)).toEqual(['01', '02', '03']);
    expect(methodologySteps.every(({ description, metricLabel, metricValue }) => description && metricLabel && metricValue)).toBe(true);
  });

  it('publishes the four learning topics in the design order', () => {
    expect(learningTopics.map(({ id }) => id)).toEqual(['business', 'academic', 'everyday', 'travel']);
    expect(learningTopics).toHaveLength(4);
  });
});
