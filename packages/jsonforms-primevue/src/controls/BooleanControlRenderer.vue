<template>
    <ControlWrapper
        v-bind="controlWrapper"
        :is-focused="isFocused"
        :applied-options="appliedOptions"
    >
        <Checkbox
            binary
            :id="control.id + '-input'"
            :disabled="!control.enabled"
            :autofocus="appliedOptions.focus"
            :placeholder="appliedOptions.placeholder"
            :modelValue="control.data"
            @update:modelValue="onChange"

        />
    </ControlWrapper>
</template>

<script lang="ts">
import {
    isBooleanControl,
    rankWith,
    type ControlElement,
    type JsonFormsRendererRegistryEntry,
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

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(1, isBooleanControl),
};
</script>
