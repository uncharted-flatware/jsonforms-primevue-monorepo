import {
  and,
  isEnumControl,
  isOneOfEnumControl,
  isStringControl,
  not,
  rankWith,
  type JsonSchema,
  type TesterContext,
  type UISchemaElement,
} from '@jsonforms/core';

export const stringControlTester = rankWith(
  2,
  and(isStringControl, not(isEnumControl), not(isOneOfEnumControl))
);

export const enumControlTester = rankWith(3, isEnumControl);

export const oneOfEnumControlTester = rankWith(5, isOneOfEnumControl);

export const labelledEnumControlTesters = [
  { id: 'string', tester: stringControlTester },
  { id: 'enum', tester: enumControlTester },
  { id: 'oneOfEnum', tester: oneOfEnumControlTester },
] as const;

export function winningLabelledEnumControlTesterId(
  uischema: UISchemaElement,
  schema: JsonSchema,
  context: TesterContext
): (typeof labelledEnumControlTesters)[number]['id'] | undefined {
  let best:
    | (typeof labelledEnumControlTesters)[number]
    | undefined;
  let bestRank = -1;

  for (const entry of labelledEnumControlTesters) {
    const rank = entry.tester(uischema, schema, context);
    if (rank > bestRank) {
      bestRank = rank;
      best = entry;
    }
  }

  return bestRank === -1 ? undefined : best?.id;
}