<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="control.data"
    >
        <div v-if="appliedOptions.displayOnly" :class="appliedOptions.compact ? 'text-900' : 'p-3 text-900'">
            {{ control.data || '' }}
        </div>
        <RadioButtonGroup
            v-else-if="isRadioFormat"
            :name="control.id + '-radio-group'"
            :model-value="control.data"
            class="flex flex-column gap-2"
            @update:model-value="onChange"
        >
            <div
                v-for="(option, index) in options"
                :key="String(option)"
                class="flex align-items-center gap-2"
            >
                <RadioButton
                    :input-id="control.id + '-radio-' + index"
                    :value="option"
                    :disabled="!control.enabled"
                />
                <label
                    :for="control.id + '-radio-' + index"
                    class="cursor-pointer"
                >{{ option }}</label>
            </div>
        </RadioButtonGroup>
        <Select
            v-else
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :options="options"
            :model-value="control.data"
            @update:model-value="onChange"
            appendTo="self"
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
import { getEnumValuesFromControl } from '../util/enumOptions';
import Select from "primevue/select";
import RadioButton from 'primevue/radiobutton';
import RadioButtonGroup from 'primevue/radiobuttongroup';

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

const isRadioFormat = computed(() => appliedOptions.value.format === 'radio');

const options = computed(() => {
    const values = getEnumValuesFromControl(control.value);
    if (values.length === 0) {
        console.warn('No enum options found for:', control.value.path);
    }
    return values;
});
</script>

<!-- 
  Note: Global PrimeVue styles removed - components now inherit from parent app's PrimeVue theme.
  This prevents style pollution and ensures consistency with the consuming application.
-->
