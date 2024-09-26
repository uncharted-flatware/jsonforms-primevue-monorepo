<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <Checkbox
            binary
            :inputId="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            v-model="control.data"
            @update:modelValue="onChange"
        />
    </ControlWrapper>
</template>

<script lang="ts">
import {
    type ControlElement,
} from '@jsonforms/core';
import {
    rendererProps,
    useJsonFormsControl,
    type RendererProps,
} from '@jsonforms/vue';
import { defineComponent } from 'vue';
import Checkbox from 'primevue/checkbox';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from "../util/composition";

const controlRenderer = defineComponent({
    name: 'boolean-control-renderer',
    components: {
        Checkbox,
        ControlWrapper,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    actions: {

    },
    setup(props: RendererProps<ControlElement>) {
        return useControlCommon(useJsonFormsControl(props));
    },
});

export default controlRenderer;
</script>
