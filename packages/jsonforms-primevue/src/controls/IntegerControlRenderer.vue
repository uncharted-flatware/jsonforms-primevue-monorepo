<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="formatDisplayValue"
    >
        <div v-if="appliedOptions.displayOnly" :class="appliedOptions.compact ? 'text-900' : 'p-3 text-900'">
            {{ formatDisplayValue }}
        </div>
        <InputNumber
            v-else
            :id="control.id"
            :inputId="control.id + '-input'"
            :showButtons="true"
            :prefix="appliedOptions.prefix"
            :suffix="appliedOptions.suffix"
            :step="step"
            :min="control.schema.minimum"
            :max="control.schema.maximum"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            inputClass="w-5rem"
            v-model="control.data"
            @update:modelValue="onChange"
        />
    </ControlWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
    type ControlElement
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsControl
} from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import InputNumber from "primevue/inputnumber";

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

const step = computed(() => {
    if (control.value.schema.multipleOf) {
        return control.value.schema.multipleOf;
    }
    if (appliedOptions.value.step) {
        return appliedOptions.value.step;
    }
    return 1;
});

const formatDisplayValue = computed(() => {
    if (control.value.data === undefined || control.value.data === null) {
        return '';
    }
    
    const prefix = appliedOptions.value.prefix || '';
    const suffix = appliedOptions.value.suffix || '';
    return `${prefix}${control.value.data}${suffix}`;
});
</script>
