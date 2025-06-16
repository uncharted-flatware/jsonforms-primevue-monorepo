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
    if (appliedOptions.value.isWrappingEnabled) {
        return 'flex flex-row flex-wrap align-items-center gap-3';
    } else if (appliedOptions.value.layout === 'space-between') {
        return 'flex flex-row flex-nowrap align-items-center justify-content-between w-full';
    } else {
        return 'flex flex-row flex-nowrap align-items-center gap-3';
    }
});
</script>
