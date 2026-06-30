import { describe, expect, it } from 'vitest';
import {
  loadPlaygroundExamples,
  playgroundExamples,
} from './loadPlaygroundExamples';

describe('loadPlaygroundExamples', () => {
  it('loads at least one example', () => {
    const examples = loadPlaygroundExamples();
    expect(examples.length).toBeGreaterThanOrEqual(1);
  });

  it('exports the same list as loadPlaygroundExamples()', () => {
    expect(playgroundExamples.length).toBe(loadPlaygroundExamples().length);
  });

  it('each example has required files and valid uiSchema layout', () => {
    const examples = loadPlaygroundExamples();
    expect(examples.length).toBe(13);

    for (const ex of examples) {
      expect(ex.id).toBeTruthy();
      expect(ex.meta.label).toBeTruthy();
      expect(typeof ex.meta.order).toBe('number');
      expect(ex.dataSchema.type).toBe('object');
      expect(ex.uiSchema.type).toBe('VerticalLayout');
      const elements = ex.uiSchema.elements as unknown[];
      expect(Array.isArray(elements)).toBe(true);
      expect(elements.length).toBeGreaterThan(0);
      expect(ex.data).toBeTypeOf('object');
    }
  });

  it('sorts examples by meta.order', () => {
    const examples = loadPlaygroundExamples();
    for (let i = 1; i < examples.length; i++) {
      expect(examples[i].meta.order).toBeGreaterThanOrEqual(
        examples[i - 1].meta.order
      );
    }
  });
});
