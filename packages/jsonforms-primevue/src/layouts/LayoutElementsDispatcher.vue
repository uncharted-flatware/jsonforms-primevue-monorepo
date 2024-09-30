<template>
    <For
        v-for="(element, index) in layout.uischema.elements"
        :key="`${layout.path}-${index}`"
    >
        <DispatchRenderer
            :schema="layout.schema"
            :uischema="element"
            :path="layout.path"
            :enabled="layout.enabled"
            :renderers="layout.renderers"
            :cells="layout.cells"
        />
    </For>
</template>

<script setup lang="ts">
import { DispatchRenderer, rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import { type Layout } from "@jsonforms/core";
import For from "../components/blocks/For.vue";

const props = defineProps(rendererProps<Layout>());
const layoutProps = useJsonFormsLayout(props);

const { layout } = layoutProps;

</script>
