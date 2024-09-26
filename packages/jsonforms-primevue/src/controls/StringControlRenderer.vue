<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <FloatLabel>
            <InputText
                :id="control.id + '-input'"
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
import InputText from "primevue/inputtext";
import FloatLabel from "primevue/floatlabel";

const controlRenderer = defineComponent({
    name: 'string-control-renderer',
    components: {
        InputText,
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
