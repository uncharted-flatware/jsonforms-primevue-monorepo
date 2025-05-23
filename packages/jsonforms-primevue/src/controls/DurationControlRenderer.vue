<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="formattedDuration"
    >
        <div v-if="appliedOptions.displayOnly" class="p-3 text-900">
            {{ formattedDuration }}
        </div>
        <InputNumber
            v-else
            :id="control.id"
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            v-model="internalValue"
            :min="0"
            :max="365"
            :step="1"
            showButtons
            inputClass="w-5rem"
            @update:modelValue="onChange"
        />
    </ControlWrapper>
</template>

<script setup lang="ts">
import {
    type ControlElement
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsControl,
} from '@jsonforms/vue';
import { ref, watch, computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import InputNumber from "primevue/inputnumber";

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControl(props);
const controlCommon = useControlCommon(controlProps, (days: number): string => {
    // Convert number of days to ISO 8601 duration format
    // TODO: Support an option to choose the scale, i.e. hours, days, months, years.
    return `P${days}D`;
});

const {
    appliedOptions,
    control,
    controlWrapper,
    isFocused,
    onChange
} = controlCommon;

// Internal state
const internalValue = ref(parseDurationToDays(control.value.data) || 7);

// // Watch for external changes
watch(() => control.value.data, (newData) => {
    internalValue.value = parseDurationToDays(newData) || 7;
});

function parseDurationToDays(duration: string): number | null {
    if (!duration) {
        return null;
    }
    // Assuming duration is in the format "P{n}D" (ISO 8601)
    const match = duration.match(/^P(\d+)D$/);
    return match ? parseInt(match[1], 10) : null;
}

const formattedDuration = computed(() => {
    const days = parseDurationToDays(control.value.data);
    if (days === null) return '';
    
    return days === 1 ? '1 day' : `${days} days`;
});
</script>

<style scoped>
</style>
