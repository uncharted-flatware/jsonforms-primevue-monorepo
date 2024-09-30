<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <Checkbox
            binary
            :id="control.id"
            :inputId="control.id + '-input'"
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
    type ControlElement,
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsControl,
} from '@jsonforms/vue';
import Checkbox from 'primevue/checkbox';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";

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
</script>
