import { describe, expect, it } from 'vitest';
import { jsonFormsDateTimeToDate } from './dateTime';

describe('jsonFormsDateTimeToDate', () => {
  it('returns null for empty values', () => {
    expect(jsonFormsDateTimeToDate(null)).toBeNull();
    expect(jsonFormsDateTimeToDate(undefined)).toBeNull();
    expect(jsonFormsDateTimeToDate('')).toBeNull();
  });

  it('parses ISO date-time strings', () => {
    const date = jsonFormsDateTimeToDate('2024-03-25T14:30:00Z');
    expect(date).toBeInstanceOf(Date);
    expect(date?.toISOString()).toBe('2024-03-25T14:30:00.000Z');
  });

  it('returns null for invalid strings', () => {
    expect(jsonFormsDateTimeToDate('not-a-date')).toBeNull();
  });

  it('passes through valid Date instances', () => {
    const input = new Date('2024-01-02T03:04:05Z');
    expect(jsonFormsDateTimeToDate(input)).toBe(input);
  });
});
