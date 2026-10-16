import { type ComputedRef, computed, inject, provide, unref, type Ref } from 'vue';
import { defaultJsonFormsPrimeVueIcons } from './defaults';
import type {
  JsonFormsPrimeVueIconOverrides,
  JsonFormsPrimeVueIcons,
} from './types';

export const JSONFORMS_PRIMEVUE_ICONS_KEY = Symbol('jsonformsPrimeVueIcons');

export function createJsonFormsPrimeVueIcons(
  overrides?: JsonFormsPrimeVueIconOverrides,
  base: JsonFormsPrimeVueIcons = defaultJsonFormsPrimeVueIcons,
): JsonFormsPrimeVueIcons {
  return { ...base, ...overrides };
}

export function provideJsonFormsPrimeVueIcons(
  overrides?: JsonFormsPrimeVueIconOverrides,
): JsonFormsPrimeVueIcons {
  const parent = inject<JsonFormsPrimeVueIcons | null>(
    JSONFORMS_PRIMEVUE_ICONS_KEY,
    null,
  );
  const icons = createJsonFormsPrimeVueIcons(
    overrides,
    parent ?? defaultJsonFormsPrimeVueIcons,
  );
  provide(JSONFORMS_PRIMEVUE_ICONS_KEY, icons);
  return icons;
}

export function useJsonFormsPrimeVueIcons(): ComputedRef<JsonFormsPrimeVueIcons> {
  const injected = inject<
    JsonFormsPrimeVueIcons | Ref<JsonFormsPrimeVueIcons>
  >(JSONFORMS_PRIMEVUE_ICONS_KEY, defaultJsonFormsPrimeVueIcons);
  return computed(() => unref(injected));
}
