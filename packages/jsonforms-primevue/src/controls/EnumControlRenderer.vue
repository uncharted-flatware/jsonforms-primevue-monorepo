<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <FloatLabel>
            <Dropdown
                :inputId="control.id + '-input'"
                :disabled="!control.enabled"
                :autofocus="appliedOptions.focus"
                :placeholder="appliedOptions.placeholder"
                :options="options"
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
    useJsonFormsEnumControl,
    type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel";

const controlRenderer = defineComponent({
    name: 'enum-control-renderer',
    components: {
        Dropdown,
        FloatLabel,
        ControlWrapper,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    computed: {
        options() {
            return this.control.options.map(option => option.value);
        }
    },
    setup(props: RendererProps<ControlElement>) {
        return useControlCommon(useJsonFormsEnumControl(props));
    }
});

export default controlRenderer;
</script>
