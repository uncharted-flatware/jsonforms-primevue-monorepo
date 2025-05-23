import {
    and,
    not,
    rankWith,
    schemaTypeIs,
    isStringControl,
    isNumberControl,
    isBooleanControl,
    isEnumControl,
    isLayout,
    isIntegerControl,
    isDateTimeControl,
    uiTypeIs,
    formatIs,
    type JsonSchema,
    isControl,
    isObjectControl,
    or,
    isPrimitiveArrayControl,
    isObjectArrayControl
} from '@jsonforms/core';

// We need to create a proper custom array control tester
// The tester should verify it's a control UI schema and array schema type
// but exclude any special array cases like ArrayItem
const isArrayControl = and(
  isControl,
  schemaTypeIs('array'),
  not(uiTypeIs('ArrayItem'))
);

import ControlWrapper from './controls/ControlWrapper.vue';
import StringControlRenderer from './controls/StringControlRenderer.vue';
import NumberControlRenderer from './controls/NumberControlRenderer.vue';
import BooleanControlRenderer from './controls/BooleanControlRenderer.vue';
import IntegerControlRenderer from './controls/IntegerControlRenderer.vue';
import EnumControlRenderer from './controls/EnumControlRenderer.vue';
import DateTimeControlRenderer from './controls/DateTimeControlRenderer.vue';
import ArrayControlRenderer from './controls/ArrayControlRenderer.vue';
import ArrayItemRenderer from './controls/ArrayItemRenderer.vue';
import ObjectControlRenderer from './controls/ObjectControlRenderer.vue';
// Layouts
import GroupLayoutRenderer from './layouts/GroupLayoutRenderer.vue';
import HorizontalLayoutRenderer from './layouts/HorizontalLayoutRenderer.vue';
import VerticalLayoutRenderer from './layouts/VerticalLayoutRenderer.vue';
import LabelRenderer from './layouts/LabelRenderer.vue';
import DurationControlRenderer from "./controls/DurationControlRenderer.vue";
import Tooltip from 'primevue/tooltip';

// List of tester/ranking + renderer presets
const renderers = [
    { tester: rankWith(2, and(isStringControl, not(isEnumControl))), renderer: StringControlRenderer },
    { tester: rankWith(3, isEnumControl), renderer: EnumControlRenderer },
    { tester: rankWith(3, isNumberControl), renderer: NumberControlRenderer },
    { tester: rankWith(3, isIntegerControl), renderer: IntegerControlRenderer },
    { tester: rankWith(2, isBooleanControl), renderer: BooleanControlRenderer },
    { tester: rankWith(3, isDateTimeControl), renderer: DateTimeControlRenderer },
    { tester: rankWith(3, formatIs('duration')), renderer: DurationControlRenderer },
    { tester: rankWith(3, or(isObjectArrayControl, isPrimitiveArrayControl)), renderer: ArrayControlRenderer },
    { tester: rankWith(3, isObjectControl), renderer: ObjectControlRenderer },
    // Layouts
    { tester: rankWith(3, and(isLayout, uiTypeIs('Group'))), renderer: GroupLayoutRenderer },
    { tester: rankWith(3, and(isLayout, uiTypeIs('HorizontalLayout'))), renderer: HorizontalLayoutRenderer },
    { tester: rankWith(3, and(isLayout, uiTypeIs('VerticalLayout'))), renderer: VerticalLayoutRenderer },
    { tester: rankWith(2, uiTypeIs('Label')), renderer: LabelRenderer }
];

// Individual Renderers for customized test/ranking
export {
    ControlWrapper,
    StringControlRenderer,
    EnumControlRenderer,
    NumberControlRenderer,
    IntegerControlRenderer,
    BooleanControlRenderer,
    DateTimeControlRenderer,
    ArrayControlRenderer,
    ArrayItemRenderer,
    ObjectControlRenderer,
    // Layouts
    GroupLayoutRenderer,
    HorizontalLayoutRenderer,
    VerticalLayoutRenderer,
    LabelRenderer,
    // Directives
    Tooltip
};

// Note: To use the tooltip feature, you must register the directive in your app:
// app.directive('tooltip', Tooltip);

export default renderers;
