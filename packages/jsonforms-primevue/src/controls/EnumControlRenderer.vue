<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <Dropdown
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :options="options"
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
    return this.control.options.map(option => option.value);
});
</script>
