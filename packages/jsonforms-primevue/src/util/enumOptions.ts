import type { EnumOption } from '@jsonforms/core';

type EnumControlLike = {
  schema?: {
    enum?: unknown[];
    oneOf?: { const?: unknown }[];
  };
  options?: EnumOption[];
};

export function getEnumValuesFromControl(control: EnumControlLike): unknown[] {
  if (control.schema?.enum) {
    return control.schema.enum;
  }

  if (control.options && control.options.length > 0) {
    return control.options.map((option) => option.value);
  }

  if (control.schema?.oneOf) {
    const enumValues = control.schema.oneOf
      .filter((item) => item.const !== undefined)
      .map((item) => item.const);
    if (enumValues.length > 0) {
      return enumValues;
    }
  }

  return [];
}
