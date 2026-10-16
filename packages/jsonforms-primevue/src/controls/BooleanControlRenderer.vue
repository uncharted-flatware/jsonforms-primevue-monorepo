<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="control.data ? 'Yes' : 'No'"
    >
        <div v-if="appliedOptions.displayOnly" class="jsonforms-row jsonforms-display-boolean-value">
            <JsonFormsIcon
                v-if="control.data"
                name="check"
                class="jsonforms-display-boolean--true"
                aria-label="Yes"
            />
            <JsonFormsIcon
                v-else
                name="close"
                class="jsonforms-display-boolean--false"
                aria-label="No"
            />
        </div>
        <Checkbox
            v-else
            binary
            :id="control.id"
            :inputId="control.id + '-input'"
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
    type ControlElement,
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsControl,
} from '@jsonforms/vue';
import Checkbox from 'primevue/checkbox';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { JsonFormsIcon } from '../icons';
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
