import { describe, expect, it } from 'vitest';
import type { ControlElement, JsonSchema } from '@jsonforms/core';
import {
  enumControlTester,
  oneOfEnumControlTester,
  stringControlTester,
  winningLabelledEnumControlTesterId,
} from './rendererTesters';

const countryDataSchema: JsonSchema = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
      title: 'Country',
      oneOf: [
        { const: 'CA', title: 'Canada' },
        { const: 'US', title: 'United States' },
        { const: 'DE', title: 'Germany' },
      ],
    },
  },
};

const countryControl: ControlElement = {
  type: 'Control',
  scope: '#/properties/country',
};

describe('renderer testers for labelled oneOf enum', () => {
  const context = { rootSchema: countryDataSchema, config: {} };

  it('picks oneOf enum tester over string and enum for country control', () => {
    expect(
      winningLabelledEnumControlTesterId(
        countryControl,
        countryDataSchema,
        context
      )
    ).toBe('oneOfEnum');
  });

  it('oneOf enum tester outranks string tester for country schema', () => {
    const stringRank = stringControlTester(
      countryControl,
      countryDataSchema,
      context
    );
    const oneOfRank = oneOfEnumControlTester(
      countryControl,
      countryDataSchema,
      context
    );
    expect(stringRank).toBe(-1);
    expect(oneOfRank).toBe(5);
    expect(oneOfRank).toBeGreaterThan(stringRank);
  });

  it('enum tester does not match oneOf-labelled string', () => {
    expect(
      enumControlTester(countryControl, countryDataSchema, context)
    ).toBe(-1);
  });
});