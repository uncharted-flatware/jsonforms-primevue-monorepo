<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="formattedDate"
    >
        <div v-if="appliedOptions.displayOnly" :class="appliedOptions.compact ? 'text-900' : 'p-3 text-900'">
            {{ formattedDate }}
        </div>
        <DatePicker
            v-else
            :id="control.id"
            :inputId="control.id + '-input'"
            showTime
            showIcon
            iconDisplay="input"
            :hourFormat="hourFormat"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
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
    useJsonFormsControl,
} from '@jsonforms/vue';
import { computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import DatePicker from "primevue/calendar";

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
</script>
