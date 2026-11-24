<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
        :display-value="displayValue"
    >
        <div v-if="appliedOptions.displayOnly" :class="displayOnlyClasses">
            {{ displayValue }}
        </div>
        <RadioButtonGroup
            v-else-if="isRadioFormat"
            :name="control.id + '-radio-group'"
            :model-value="control.data"
            class="jsonforms-stack"
            @update:model-value="onChange"
        >
            <div
                v-for="(option, index) in options"
                :key="String(option.value)"
                class="jsonforms-radio-option"
            >
                <RadioButton
                    :input-id="control.id + '-radio-' + index"
                    :value="option.value"
                    :disabled="!control.enabled"
                />
                <label :for="control.id + '-radio-' + index">{{ option.label }}</label>
            </div>
        </RadioButtonGroup>
        <Select
            v-else
            fluid
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :options="options"
            optionLabel="label"
            optionValue="value"
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
import {
    enumDisplayLabelForValue,
    getEnumOptionsFromControl,
} from '../util/enumOptions';
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
    const enumOptions = getEnumOptionsFromControl(control.value);
    if (enumOptions.length === 0) {
        console.warn('No enum options found for:', control.value.path);
    }
    return enumOptions;
});

const displayValue = computed(() =>
    enumDisplayLabelForValue(control.value.data, options.value)
);

const displayOnlyClasses = computed(() => {
    const classes = ['jsonforms-display-value'];
    if (!appliedOptions.value.compact) {
        classes.push('jsonforms-display-value--padded');
    }
    return classes.join(' ');
});
</script>