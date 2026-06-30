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

const displayOnlyClasses = computed(() =>
    appliedOptions.value.compact ? 'text-900' : 'p-2 text-900'
);

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
                class="flex flex-column"
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

<style scoped>
/* Scoped styles for text inputs within this control */
:deep(.p-inputtext),
:deep(.p-textarea) {
    border: 1px solid var(--surface-border) !important;
    border-radius: 4px !important;
    padding: 0.5rem 0.75rem !important;
    background: var(--surface-0, #ffffff) !important;
    width: 100%;
    font-size: var(--text-size, 1rem);
    transition: border-color 0.2s;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
    outline: none;
    border-color: var(--primary-color, #f02896) !important;
    box-shadow: 0 0 0 0.2rem rgba(240, 40, 150, 0.25);
}

:deep(.p-inputtext:disabled),
:deep(.p-textarea:disabled) {
    background: var(--surface-100, #f8f9fa) !important;
    opacity: 0.6;
}
</style>
