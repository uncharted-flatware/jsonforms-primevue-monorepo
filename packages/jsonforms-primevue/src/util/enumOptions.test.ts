import { describe, expect, it } from 'vitest';
import {
  enumDisplayLabelForValue,
  getEnumOptionsFromControl,
} from './enumOptions';

describe('getEnumOptionsFromControl', () => {
  const countryOneOf = [
    { const: 'CA', title: 'Canada' },
    { const: 'US', title: 'United States' },
    { const: 'DE', title: 'Germany' },
  ];

  it('prefers schema.enum with value-as-label', () => {
    expect(
      getEnumOptionsFromControl({
        schema: { enum: ['a', 'b'] },
        options: [{ value: 'x', label: 'X' }],
      })
    ).toEqual([
      { value: 'a', label: 'a' },
      { value: 'b', label: 'b' },
    ]);
  });

  it('falls back to control options', () => {
    expect(
      getEnumOptionsFromControl({
        schema: {},
        options: [
          { value: 'x', label: 'X' },
          { value: 'y', label: 'Y' },
        ],
      })
    ).toEqual([
      { value: 'x', label: 'X' },
      { value: 'y', label: 'Y' },
    ]);
  });

  it('maps labelled oneOf to title and const', () => {
    expect(
      getEnumOptionsFromControl({
        schema: { oneOf: countryOneOf },
      })
    ).toEqual([
      { value: 'CA', label: 'Canada' },
      { value: 'US', label: 'United States' },
      { value: 'DE', label: 'Germany' },
    ]);
  });

  it('falls back label when oneOf title is missing', () => {
    expect(
      getEnumOptionsFromControl({
        schema: {
          oneOf: [{ const: 'x' }, { const: 1 }, { const: false }],
        },
      })
    ).toEqual([
      { value: 'x', label: 'x' },
      { value: 1, label: '1' },
      { value: false, label: 'false' },
    ]);
  });

  it('json-stringifies object const when title is missing', () => {
    const objectConst = { id: 1 };
    expect(
      getEnumOptionsFromControl({
        schema: {
          oneOf: [{ const: objectConst }],
        },
      })
    ).toEqual([{ value: objectConst, label: '{"id":1}' }]);
  });

  it('keeps const 0 and false', () => {
    expect(
      getEnumOptionsFromControl({
        schema: {
          oneOf: [
            { const: 0, title: 'Zero' },
            { const: false, title: 'No' },
          ],
        },
      })
    ).toEqual([
      { value: 0, label: 'Zero' },
      { value: false, label: 'No' },
    ]);
  });

  it('skips oneOf entries without const', () => {
    expect(
      getEnumOptionsFromControl({
        schema: {
          oneOf: [{ const: 'a', title: 'A' }, { title: 'Orphan' }],
        },
      })
    ).toEqual([{ value: 'a', label: 'A' }]);
  });

  it('returns empty array when no options exist', () => {
    expect(getEnumOptionsFromControl({ schema: {} })).toEqual([]);
  });
});

describe('enumDisplayLabelForValue', () => {
  const countryOptions = [
    { value: 'CA', label: 'Canada' },
    { value: 'US', label: 'United States' },
  ];

  it('shows option title for a known const (displayOnly)', () => {
    expect(enumDisplayLabelForValue('CA', countryOptions)).toBe('Canada');
  });

  it('returns empty string for nullish data', () => {
    expect(enumDisplayLabelForValue(undefined, countryOptions)).toBe('');
    expect(enumDisplayLabelForValue(null, countryOptions)).toBe('');
  });

  it('falls back with enumLabelForConst when value is not in options', () => {
    expect(enumDisplayLabelForValue('XX', countryOptions)).toBe('XX');
    expect(enumDisplayLabelForValue({ id: 2 }, countryOptions)).toBe('{"id":2}');
  });
});