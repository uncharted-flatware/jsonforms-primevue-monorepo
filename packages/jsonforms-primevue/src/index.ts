import {
    rankWith,
    isStringControl,
    isNumberControl,
    isBooleanControl,
    //uiTypeIs,
} from '@jsonforms/core';
import StringControlRenderer from './controls/StringControlRenderer.vue';
import NumberControlRenderer from './controls/NumberControlRenderer.vue';
import BooleanControlRenderer from './controls/BooleanControlRenderer.vue';

const renderers = [
    // { tester: rankWith(3, isStringControl), renderer: StringControlRenderer },
    // { tester: rankWith(3, isNumberControl), renderer: NumberControlRenderer },
    { tester: rankWith(3, isBooleanControl), renderer: BooleanControlRenderer },
    // {
    //     tester: rankWith(1, uiTypeIs('VerticalLayout')),
    //     renderer: VerticalLayoutRenderer,
    // },
];

export {
  // StringControlRenderer,
  // NumberControlRenderer,
  BooleanControlRenderer
};

export default renderers;
