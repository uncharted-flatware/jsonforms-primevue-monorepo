<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <FloatLabel>
            <DatePicker
                :id="control.id + '-input'"
                showTime
                :hourFormat="hourFormat"
                :disabled="!control.enabled"
                :autofocus="appliedOptions.focus"
                :placeholder="appliedOptions.placeholder"
                v-model="control.data"
                @update:modelValue="onChange"
            />
            <label :for="control.id + '-input'">{{ control.label }}</label>
        </FloatLabel>
    </ControlWrapper>
</template>

<script lang="ts">
import {
    type ControlElement
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsControl,
    type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import DatePicker from "primevue/calendar";
import FloatLabel from "primevue/floatlabel";

const controlRenderer = defineComponent({
    name: 'date-time-control-renderer',
    components: {
        DatePicker,
        FloatLabel,
        ControlWrapper,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    computed: {
        hourFormat(): string {
            return this.appliedOptions.hourFormat === '24' ? '24' : '12';
        }
    },
    setup(props: RendererProps<ControlElement>) {
        return useControlCommon(useJsonFormsControl(props), (primeVueValue: Date): string => {
            // PrimeVue outputs Date objects so convert them back to strings
            return primeVueValue.toISOString();
        });
    }
});

export default controlRenderer;
</script>
