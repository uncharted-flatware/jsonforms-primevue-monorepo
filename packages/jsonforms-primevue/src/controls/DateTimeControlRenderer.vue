<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="formattedDate"
    >
        <div v-if="appliedOptions.displayOnly" :class="displayOnlyClasses">
            {{ formattedDate }}
        </div>
        <DatePicker
            v-else
            fluid
            :id="control.id"
            :inputId="control.id + '-input'"
            showTime
            showIcon
            :hourFormat="hourFormat"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :model-value="datePickerValue"
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
    useJsonFormsControl,
} from '@jsonforms/vue';
import { computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import { jsonFormsDateTimeToDate } from '../util/dateTime';
import DatePicker from "primevue/datepicker";

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControl(props);
const controlCommon = useControlCommon(controlProps, (primeVueValue: Date): string => {
    // PrimeVue outputs Date objects so convert them back to strings
    return primeVueValue.toISOString();
});

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

const datePickerValue = computed(() => jsonFormsDateTimeToDate(control.value.data));

const formattedDate = computed(() => {
    if (!control.value.data) {
        return '';
    }
    
    try {
        const date = new Date(control.value.data);
        return date.toLocaleString();
    } catch (e) {
        return control.value.data;
    }
});

const displayOnlyClasses = computed(() => {
    const classes = ['jsonforms-display-value'];
    if (!appliedOptions.value.compact) {
        classes.push('jsonforms-display-value--padded');
    }
    return classes.join(' ');
});
</script>
