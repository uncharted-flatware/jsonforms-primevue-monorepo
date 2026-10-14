<template>
    <div v-if="layout.visible" :class="layoutClasses">
        <LayoutElementsDispatcher v-bind="{ ...props }" />
    </div>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import { type Layout } from "@jsonforms/core";
import LayoutElementsDispatcher from "./LayoutElementsDispatcher.vue";
import { useLayoutCommon } from "../util/composition";
import { computed } from "vue";

const props = defineProps(rendererProps<Layout>());
const layoutProps = useJsonFormsLayout(props);
const layoutCommon = useLayoutCommon(layoutProps);

const { appliedOptions, layout } = layoutCommon;

const layoutClasses = computed(() => {
    const classes = ['jsonforms-layout', 'jsonforms-row'];
    if (appliedOptions.value.isWrappingEnabled) {
        classes.push('jsonforms-row--wrap');
    } else if (appliedOptions.value.layout === 'space-between') {
        classes.push('jsonforms-row--between');
    }
    return classes.join(' ');
});
</script>
