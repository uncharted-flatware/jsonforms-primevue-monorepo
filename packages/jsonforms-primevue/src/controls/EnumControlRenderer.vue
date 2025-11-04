<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="control.data"
    >
        <div v-if="appliedOptions.displayOnly" :class="appliedOptions.compact ? 'text-900' : 'p-3 text-900'">
            {{ control.data || '' }}
        </div>
        <Select
            v-else
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :options="options"
            :model-value="control.data"
            @update:model-value="onChange"
            appendTo="self"
        />
    </ControlWrapper>
</template>

<script setup lang="ts">
import {
    type ControlElement
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsEnumControl
} from '@jsonforms/vue';
import { computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import Select from "primevue/select";

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsEnumControl(props);
const controlCommon = useControlCommon(controlProps);

const {
    appliedOptions,
    control,
    controlWrapper,
    isFocused,
    onChange
} = controlCommon;

const options = computed(() => {

    // FIRST: Check schema.enum - this should be the primary source
    if (control.value.schema && control.value.schema.enum) {
        return control.value.schema.enum;
    }
    
    // SECOND: Use JSONForms control options if available (for compatibility)
    if (control.value.options && control.value.options.length > 0) {
        return control.value.options.map(option => option.value);
    }
    
    // THIRD: Check for oneOf enum pattern
    if (control.value.schema && control.value.schema.oneOf) {
        const enumValues = control.value.schema.oneOf
            .filter((item: any) => item.const !== undefined)
            .map((item: any) => item.const);
        if (enumValues.length > 0) {
            return enumValues;
        }
    }
    
    console.warn('No enum options found for:', control.value.path);
    return [];
});
</script>

<style>
/* Global styles for dropdown overlays - scoped to jsonforms components */
.jsonforms-control .p-select-overlay,
.jsonforms-control ~ .p-select-overlay,
.jsonforms-layout .p-select-overlay,
.jsonforms-layout ~ .p-select-overlay,
.p-select-overlay.jsonforms-overlay {
    z-index: 9999 !important;
    background: var(--surface-0, #ffffff) !important;
    border: 1px solid var(--surface-border) !important;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.jsonforms-control .p-select-list,
.jsonforms-control ~ .p-select-list,
.jsonforms-layout .p-select-list,
.jsonforms-layout ~ .p-select-list,
.p-select-list.jsonforms-overlay {
    z-index: 9999 !important;
    background: var(--surface-0, #ffffff) !important;
    padding: 0.25rem 0;
}

.jsonforms-control .p-select-option,
.jsonforms-control ~ .p-select-overlay .p-select-option,
.jsonforms-layout .p-select-option,
.jsonforms-layout ~ .p-select-overlay .p-select-option {
    padding: 0.5rem 1rem;
    cursor: pointer;
    background: var(--surface-0, #ffffff);
}

.jsonforms-control .p-select-option:hover,
.jsonforms-control ~ .p-select-overlay .p-select-option:hover,
.jsonforms-layout .p-select-option:hover,
.jsonforms-layout ~ .p-select-overlay .p-select-option:hover,
.jsonforms-control .p-select-option[data-p-focused="true"],
.jsonforms-control ~ .p-select-overlay .p-select-option[data-p-focused="true"],
.jsonforms-layout .p-select-option[data-p-focused="true"],
.jsonforms-layout ~ .p-select-overlay .p-select-option[data-p-focused="true"] {
    background: var(--surface-100, #f8f9fa) !important;
}

.jsonforms-control .p-select-option[data-p-selected="true"],
.jsonforms-control ~ .p-select-overlay .p-select-option[data-p-selected="true"],
.jsonforms-layout .p-select-option[data-p-selected="true"],
.jsonforms-layout ~ .p-select-overlay .p-select-option[data-p-selected="true"] {
    background: var(--primary-color, #f02896) !important;
    color: white !important;
}
</style>
