import { defineComponent } from 'vue';
import { describe, expect, it } from 'vitest';
import { createJsonFormsPrimeVueIcons } from './context';
import { defaultJsonFormsPrimeVueIcons } from './defaults';
import { JSONFORMS_PRIMEVUE_ICON_NAMES } from './types';

describe('createJsonFormsPrimeVueIcons', () => {
  it('includes every documented icon name in defaults', () => {
    for (const name of JSONFORMS_PRIMEVUE_ICON_NAMES) {
      expect(defaultJsonFormsPrimeVueIcons[name]).toBeDefined();
    }
  });

  it('overrides only the icons passed in', () => {
    const StubPlus = defineComponent({ name: 'StubPlus', template: '<span />' });
    const icons = createJsonFormsPrimeVueIcons({ plus: StubPlus });

    expect(icons.plus).toBe(StubPlus);
    expect(icons.info).toBe(defaultJsonFormsPrimeVueIcons.info);
    expect(icons.trash).toBe(defaultJsonFormsPrimeVueIcons.trash);
  });

  it('merges overrides onto a custom base map', () => {
    const BaseInfo = defineComponent({ name: 'BaseInfo', template: '<span />' });
    const base = createJsonFormsPrimeVueIcons({ info: BaseInfo });
    const OverridePlus = defineComponent({ name: 'OverridePlus', template: '<span />' });
    const icons = createJsonFormsPrimeVueIcons({ plus: OverridePlus }, base);

    expect(icons.info).toBe(BaseInfo);
    expect(icons.plus).toBe(OverridePlus);
  });
});
