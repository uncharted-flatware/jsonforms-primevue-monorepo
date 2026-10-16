import { defineComponent, h, type Component } from 'vue';
import {
  PhCaretDown,
  PhCaretUp,
  PhCheck,
  PhInfo,
  PhPlus,
  PhTrash,
  PhX,
} from '@phosphor-icons/vue';
import type { JsonFormsPrimeVueIcons } from '@uncharted.software/jsonforms-primevue';

type PhosphorProps = {
  size?: number | string;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
};

function wrapPhosphorIcon(Icon: Component, props: PhosphorProps = { size: 16, weight: 'bold' }) {
  return defineComponent({
    name: `Playground${Icon.name ?? 'PhosphorIcon'}`,
    render() {
      return h(Icon, props);
    },
  });
}

/** Phosphor mapping for the custom-icons-demo playground example (filled, heavier than built-in strokes). */
export const phosphorJsonFormsIcons: JsonFormsPrimeVueIcons = {
  info: wrapPhosphorIcon(PhInfo, { size: 16, weight: 'fill' }),
  plus: wrapPhosphorIcon(PhPlus, { weight: 'fill' }),
  chevronUp: wrapPhosphorIcon(PhCaretUp, { weight: 'fill' }),
  chevronDown: wrapPhosphorIcon(PhCaretDown, { weight: 'fill' }),
  trash: wrapPhosphorIcon(PhTrash, { weight: 'fill' }),
  check: wrapPhosphorIcon(PhCheck, { size: 22, weight: 'fill' }),
  close: wrapPhosphorIcon(PhX, { size: 22, weight: 'fill' }),
  circleFill: wrapPhosphorIcon(PhCheck, { size: 16, weight: 'fill' }),
};
