import {
    and,
    not,
    rankWith,
    isStringControl,
    isNumberControl,
    isBooleanControl,
    isEnumControl,
    isLayout,
    isIntegerControl,
    isDateTimeControl,
    uiTypeIs
} from '@jsonforms/core';
import StringControlRenderer from './controls/StringControlRenderer.vue';
import NumberControlRenderer from './controls/NumberControlRenderer.vue';
import BooleanControlRenderer from './controls/BooleanControlRenderer.vue';
import GroupLayoutRenderer from './layouts/GroupLayoutRenderer.vue';
import IntegerControlRenderer from './controls/IntegerControlRenderer.vue';
import EnumControlRenderer from './controls/EnumControlRenderer.vue';
import DateTimeControlRenderer from './controls/DateTimeControlRenderer.vue';

// List of tester/ranking + renderer presets
const renderers = [
    { tester: rankWith(2, and(isStringControl, not(isEnumControl))), renderer: StringControlRenderer },
    { tester: rankWith(3, isEnumControl), renderer: EnumControlRenderer },
    { tester: rankWith(3, isNumberControl), renderer: NumberControlRenderer },
    { tester: rankWith(3, isIntegerControl), renderer: IntegerControlRenderer },
    { tester: rankWith(2, isBooleanControl), renderer: BooleanControlRenderer },
    { tester: rankWith(3, isDateTimeControl), renderer: DateTimeControlRenderer },
    // {
    //     tester: rankWith(1, uiTypeIs('VerticalLayout')),
    //     renderer: VerticalLayoutRenderer,
    // },
    { tester: rankWith(3, and(isLayout, uiTypeIs('Group'))), renderer: GroupLayoutRenderer }
];

// Individual Renderers for customized test/ranking
export {
    StringControlRenderer,
    EnumControlRenderer,
    NumberControlRenderer,
    IntegerControlRenderer,
    BooleanControlRenderer,
    DateTimeControlRenderer,
    // Layouts
    GroupLayoutRenderer
};

export default renderers;
