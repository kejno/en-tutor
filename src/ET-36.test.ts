import { describe, expect, it } from 'vitest';
import { methodologySteps } from './methodology';

describe('ET-36: трёхшаговый метод беглой речи', () => {
  it('содержит три упорядоченные карточки с описанием и показателем результата', () => {
    expect(methodologySteps).toHaveLength(3);
    expect(methodologySteps.map(({ number }) => number)).toEqual(['01', '02', '03']);
    expect(methodologySteps.every(({ title, description, metricLabel, metricValue }) => title && description && metricLabel && metricValue)).toBe(true);
  });
});
