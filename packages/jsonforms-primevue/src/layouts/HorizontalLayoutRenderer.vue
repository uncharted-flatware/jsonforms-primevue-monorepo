<template>
    <div v-if="layout.visible" class="flex flex-row flex-wrap align-content-start gap-3">
        <LayoutElementsDispatcher v-bind="{ ...props }" />
    </div>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import { type Layout } from "@jsonforms/core";
import LayoutElementsDispatcher from "./LayoutElementsDispatcher.vue";

const props = defineProps(rendererProps<Layout>());
const layoutProps = useJsonFormsLayout(props);

const { layout } = layoutProps;
</script>
