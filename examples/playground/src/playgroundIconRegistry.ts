import { shallowRef, type ShallowRef } from 'vue';
import {
  defaultJsonFormsPrimeVueIcons,
  type JsonFormsPrimeVueIcons,
} from '@uncharted.software/jsonforms-primevue';
import { phosphorJsonFormsIcons } from './phosphorJsonFormsIcons';

export const CUSTOM_ICONS_DEMO_EXAMPLE_ID = 'custom-icons-demo';

export const playgroundIconRegistry: ShallowRef<JsonFormsPrimeVueIcons> =
  shallowRef(defaultJsonFormsPrimeVueIcons);

export function syncPlaygroundIconRegistry(exampleId: string): void {
  playgroundIconRegistry.value =
    exampleId === CUSTOM_ICONS_DEMO_EXAMPLE_ID
      ? phosphorJsonFormsIcons
      : defaultJsonFormsPrimeVueIcons;
}
