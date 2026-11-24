import type { EnumOption } from '@jsonforms/core';

type OneOfEnumSubschema = {
  const?: unknown;
  title?: string;
};

type EnumControlLike = {
  schema?: {
    enum?: unknown[];
    oneOf?: OneOfEnumSubschema[];
  };
  options?: EnumOption[];
};

export function enumLabelForConst(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export function getEnumOptionsFromControl(
  control: EnumControlLike
): EnumOption[] {
  if (control.schema?.enum) {
    return control.schema.enum.map((value) => ({
      value,
      label: enumLabelForConst(value),
    }));
  }

  if (control.options && control.options.length > 0) {
    return control.options;
  }

  if (control.schema?.oneOf) {
    const options = control.schema.oneOf
      .filter((item) => item.const !== undefined)
      .map((item) => ({
        value: item.const as unknown,
        label: item.title ?? enumLabelForConst(item.const),
      }));
    if (options.length > 0) {
      return options;
    }
  }

  return [];
}

export function enumDisplayLabelForValue(
  data: unknown,
  options: EnumOption[]
): string {
  if (data === undefined || data === null) {
    return '';
  }
  const match = options.find((option) => option.value === data);
  return match?.label ?? enumLabelForConst(data);
}