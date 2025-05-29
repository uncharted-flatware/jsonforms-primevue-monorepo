<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="control.data"
    >
        <div v-if="appliedOptions.displayOnly" :class="appliedOptions.compact ? 'text-900' : 'p-2 text-900'">
            {{ formatDisplayValue }}
        </div>
        <InputText
            v-else
            :id="control.id"
            :inputId="control.id + '-input'"
            :model-value="control.data"
            :disabled="!control.enabled || !!appliedOptions.readonly"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
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
    useJsonFormsControl
} from '@jsonforms/vue';
import { computed } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import InputText from "primevue/inputtext";

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

const formatDisplayValue = computed(() => {
    if (control.value.data === undefined || control.value.data === null) {
        return '';
    }
    
    const prefix = appliedOptions.value.prefix || '';
    const suffix = appliedOptions.value.suffix || '';
    return `${prefix}${control.value.data}${suffix}`;
});


</script>
