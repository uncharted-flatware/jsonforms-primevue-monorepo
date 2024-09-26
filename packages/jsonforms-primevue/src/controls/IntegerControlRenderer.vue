<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <FloatLabel>
            <InputNumber
                :id="control.id"
                :inputId="control.id + '-input'"
                :showButtons="true"
                :disabled="!control.enabled"
                :autofocus="appliedOptions.focus"
                :placeholder="appliedOptions.placeholder"
                v-model="control.data"
                @update:modelValue="onChange"
            />
            <label :for="control.id">{{ control.label }}</label>
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
import InputNumber from "primevue/inputnumber";
import FloatLabel from "primevue/floatlabel";

const controlRenderer = defineComponent({
    name: 'integer-control-renderer',
    components: {
        InputNumber,
        FloatLabel,
        ControlWrapper,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    actions: {

    },
    setup(props: RendererProps<ControlElement>) {
        return useControlCommon(useJsonFormsControl(props));
    }
});

export default controlRenderer;
</script>
