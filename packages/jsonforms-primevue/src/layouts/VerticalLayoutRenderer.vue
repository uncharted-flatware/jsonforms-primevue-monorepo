<template>
    <div v-if="layout.visible" class="jsonforms-layout jsonforms-stack--loose">
        <LayoutElementsDispatcher v-bind="{ ...props }" />
    </div>
</template>

<script setup lang="ts">
import { rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import { type Layout } from "@jsonforms/core";
import LayoutElementsDispatcher from "./LayoutElementsDispatcher.vue";
import { useLayoutCommon } from "../util/composition";

const props = defineProps(rendererProps<Layout>());
const layoutProps = useJsonFormsLayout(props);
const layoutCommon = useLayoutCommon(layoutProps);

const { layout } = layoutCommon;
</script>
