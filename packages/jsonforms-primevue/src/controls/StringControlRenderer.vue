<script setup lang="ts">
import {
    type ControlElement
} from '@jsonforms/core';

import {
    rendererProps,
    useJsonFormsControl
} from '@jsonforms/vue';
import { computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControl(props);
const controlCommon = useControlCommon(controlProps);

const {
    appliedOptions,
    control,
    controlWrapper,
    isFocused,
    onChange
} = controlCommon;

const isMultiLine = computed(() => !!appliedOptions.value.multi);

const formatDisplayValue = computed(() => {
    if (control.value.data === undefined || control.value.data === null) {
        return '';
    }

    const prefix = appliedOptions.value.prefix || '';
    const suffix = appliedOptions.value.suffix || '';
    return `${prefix}${control.value.data}${suffix}`;
});

const displayOnlyClasses = computed(() => {
    const classes = ['jsonforms-display-value'];
    if (!appliedOptions.value.compact) {
        classes.push('jsonforms-display-value--compact-pad');
    }
    return classes.join(' ');
});

const isDisplayOnlyMultiline = computed(() => {
    if (!appliedOptions.value.displayOnly) {
        return false;
    }
    if (isMultiLine.value) {
        return true;
    }
    const data = control.value.data;
    return typeof data === 'string' && /\r?\n/.test(data);
});

const displayOnlyLineSegments = computed(() =>
    formatDisplayValue.value.split(/\r?\n/)
);

const textareaRows = computed(() => appliedOptions.value.rows ?? 3);
</script>

<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="control.data"
    >
        <div v-if="appliedOptions.displayOnly" :class="displayOnlyClasses">
            <div
                v-if="isDisplayOnlyMultiline"
                class="jsonforms-stack--compact"
            >
                <span
                    v-for="(segment, index) in displayOnlyLineSegments"
                    :key="index"
                >{{ segment === '' ? '\u00a0' : segment }}</span>
            </div>
            <template v-else>{{ formatDisplayValue }}</template>
        </div>
        <Textarea
            v-else-if="isMultiLine"
            fluid
            :id="control.id"
            :inputId="control.id + '-input'"
            :model-value="control.data"
            :disabled="!control.enabled || !!appliedOptions.readonly"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :rows="textareaRows"
            @update:model-value="onChange"
        />
        <InputText
            v-else
            fluid
            :id="control.id"
            :inputId="control.id + '-input'"
            :model-value="control.data"
            :disabled="!control.enabled || !!appliedOptions.readonly"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            @update:model-value="onChange"
        />
    </ControlWrapper>
</template>
