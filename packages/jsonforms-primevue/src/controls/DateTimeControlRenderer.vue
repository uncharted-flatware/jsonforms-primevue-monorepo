<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <DatePicker
            :id="control.id"
            :inputId="control.id + '-input'"
            showTime
            :hourFormat="hourFormat"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            v-model="control.data"
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
import { computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import DatePicker from "primevue/calendar";

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControl(props, (primeVueValue: Date): string => {
    // PrimeVue outputs Date objects so convert them back to strings
    return primeVueValue.toISOString();
});
const controlCommon = useControlCommon(controlProps);

const {
    appliedOptions,
    control,
    controlWrapper,
    isFocused,
    onChange
} = controlCommon;

const hourFormat = computed(() => {
    return appliedOptions.value.hourFormat === '24' ? '24' : '12';
});
</script>
