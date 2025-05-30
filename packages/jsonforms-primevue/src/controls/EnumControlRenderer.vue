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
        <Dropdown
            v-else
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :options="options"
            :model-value="control.data"
            @update:model-value="onChange"
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
import Dropdown from "primevue/dropdown";

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
