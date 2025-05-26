<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="control.data ? 'Yes' : 'No'"
    >
        <div v-if="appliedOptions.displayOnly" class="flex align-items-center gap-2">
            <i v-if="control.data" class="pi pi-check text-green-600" aria-label="Yes"></i>
            <i v-else class="pi pi-times text-red-600" aria-label="No"></i>
        </div>
        <Checkbox
            v-else
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
