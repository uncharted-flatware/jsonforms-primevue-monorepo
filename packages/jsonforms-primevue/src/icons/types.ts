import type { Component } from 'vue';

export const JSONFORMS_PRIMEVUE_ICON_NAMES = [
  'info',
  'plus',
  'chevronUp',
  'chevronDown',
  'trash',
  'check',
  'close',
  'circleFill',
] as const;

export type JsonFormsPrimeVueIconName = (typeof JSONFORMS_PRIMEVUE_ICON_NAMES)[number];

export type JsonFormsPrimeVueIconComponent = Component;

export type JsonFormsPrimeVueIcons = Record<
  JsonFormsPrimeVueIconName,
  JsonFormsPrimeVueIconComponent
>;

export type JsonFormsPrimeVueIconOverrides = Partial<JsonFormsPrimeVueIcons>;
