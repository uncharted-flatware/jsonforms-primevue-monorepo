import {
    rankWith,
    isStringControl,
    isNumberControl,
    isBooleanControl, and, not, isEnumControl, uiTypeIs, isLayout, isIntegerControl,
    //uiTypeIs,
} from '@jsonforms/core';
import StringControlRenderer from './controls/StringControlRenderer.vue';
import NumberControlRenderer from './controls/NumberControlRenderer.vue';
import BooleanControlRenderer from './controls/BooleanControlRenderer.vue';
import GroupLayoutRenderer from './layouts/GroupLayoutRenderer.vue';
import IntegerControlRenderer from "./controls/IntegerControlRenderer.vue";

// List of tester/ranking + renderer presets
const renderers = [
    { tester: rankWith(2, and(isStringControl, not(isEnumControl))), renderer: StringControlRenderer },
    { tester: rankWith(3, isNumberControl), renderer: NumberControlRenderer },
    { tester: rankWith(3, isIntegerControl), renderer: IntegerControlRenderer },
    { tester: rankWith(2, isBooleanControl), renderer: BooleanControlRenderer },
    // {
    //     tester: rankWith(1, uiTypeIs('VerticalLayout')),
    //     renderer: VerticalLayoutRenderer,
    // },
    { tester: rankWith(3, and(isLayout, uiTypeIs('Group'))), renderer: GroupLayoutRenderer }
];

// Individual Renderers for customized test/ranking
export {
    StringControlRenderer,
    NumberControlRenderer,
    IntegerControlRenderer,
    BooleanControlRenderer,
    // Layouts
    GroupLayoutRenderer
};

export default renderers;
