// src/renderers/index.js
import {
  rankWith,
  isStringControl,
  isNumberControl,
  isBooleanControl,
  uiTypeIs,
} from '@jsonforms/core';
import StringControlRenderer from './StringControlRenderer.vue';
import NumberControlRenderer from './NumberControlRenderer.vue';
import BooleanControlRenderer from './BooleanControlRenderer.vue';
import VerticalLayoutRenderer from './VerticalLayoutRenderer.vue';

const renderers = [
  { tester: rankWith(3, isStringControl), renderer: StringControlRenderer },
  { tester: rankWith(3, isNumberControl), renderer: NumberControlRenderer },
  { tester: rankWith(3, isBooleanControl), renderer: BooleanControlRenderer },
  {
    tester: rankWith(1, uiTypeIs('VerticalLayout')),
    renderer: VerticalLayoutRenderer,
  },
];

export default renderers;
