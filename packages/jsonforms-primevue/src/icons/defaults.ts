import { defineComponent, h } from 'vue';
import type { JsonFormsPrimeVueIcons } from './types';

const svgAttrs = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': 1.25,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  'aria-hidden': 'true',
};

function strokeIcon(paths: ReturnType<typeof h>[]) {
  return defineComponent({
    name: 'JsonFormsDefaultStrokeIcon',
    render() {
      return h('svg', svgAttrs, paths);
    },
  });
}

function fillIcon(pathD: string) {
  return defineComponent({
    name: 'JsonFormsDefaultFillIcon',
    render() {
      return h('svg', { ...svgAttrs, fill: 'currentColor', stroke: 'none' }, [
        h('path', { d: pathD }),
      ]);
    },
  });
}

const InfoIcon = strokeIcon([
  h('circle', { cx: 12, cy: 12, r: 10 }),
  h('path', { d: 'M12 16v-4' }),
  h('path', { d: 'M12 8h.01' }),
]);

const PlusIcon = strokeIcon([
  h('path', { d: 'M12 5v14' }),
  h('path', { d: 'M5 12h14' }),
]);

const ChevronUpIcon = strokeIcon([h('path', { d: 'm18 15-6-6-6 6' })]);

const ChevronDownIcon = strokeIcon([h('path', { d: 'm6 9 6 6 6-6' })]);

const TrashIcon = strokeIcon([
  h('path', { d: 'M3 6h18' }),
  h('path', { d: 'M8 6V4h8v2' }),
  h('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }),
  h('path', { d: 'M10 11v6' }),
  h('path', { d: 'M14 11v6' }),
]);

const CheckIcon = strokeIcon([h('path', { d: 'M20 6 9 17l-5-5' })]);

const CloseIcon = strokeIcon([
  h('path', { d: 'M18 6 6 18' }),
  h('path', { d: 'm6 6 12 12' }),
]);

const CircleFillIcon = fillIcon('M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z');

export const defaultJsonFormsPrimeVueIcons: JsonFormsPrimeVueIcons = {
  info: InfoIcon,
  plus: PlusIcon,
  chevronUp: ChevronUpIcon,
  chevronDown: ChevronDownIcon,
  trash: TrashIcon,
  check: CheckIcon,
  close: CloseIcon,
  circleFill: CircleFillIcon,
};
