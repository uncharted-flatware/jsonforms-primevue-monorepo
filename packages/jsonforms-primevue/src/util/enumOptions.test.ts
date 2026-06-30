import { describe, expect, it } from 'vitest';
import { getEnumValuesFromControl } from './enumOptions';

describe('getEnumValuesFromControl', () => {
  it('prefers schema.enum', () => {
    expect(
      getEnumValuesFromControl({
        schema: { enum: ['a', 'b'] },
        options: [{ value: 'x', label: 'X' }],
      })
    ).toEqual(['a', 'b']);
  });

  it('falls back to control options', () => {
    expect(
      getEnumValuesFromControl({
        schema: {},
        options: [
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
        ],
      })
    ).toEqual(['x', 'y']);
  });

  it('reads oneOf const values', () => {
    expect(
      getEnumValuesFromControl({
        schema: {
          oneOf: [{ const: 1 }, { const: 2 }],
        },
      })
    ).toEqual([1, 2]);
  });

  it('returns empty array when no options exist', () => {
    expect(getEnumValuesFromControl({ schema: {} })).toEqual([]);
  });
});
