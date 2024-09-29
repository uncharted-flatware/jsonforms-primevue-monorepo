<template>
    <If v-if="isToggleable">
        <Accordion v-if="layout.visible" :activeIndex="accordionIndexForExpansion">
            <AccordionTab :header="layout.label">
                <LayoutElementsDispatcher v-bind="{ ...props }" />
            </AccordionTab>
        </Accordion>
    </If>
    <Else v-else>
        <Panel
            v-if="layout.visible"
            :header="layout.label"
            :toggleable="isToggleable"
        >
            <LayoutElementsDispatcher v-bind="{ ...props }" />
        </Panel>
    </Else>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DispatchRenderer, rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Panel from "primevue/panel";
import { type Layout } from "@jsonforms/core";
import { useLayoutCommon } from "../util/composition";
import If from "../components/If.vue";
import For from "../components/For.vue";
import Else from "../components/Else.vue";
import LayoutElementsDispatcher from "./LayoutElementsDispatcher.vue";

const props = defineProps(rendererProps<Layout>());
const layoutProps = useJsonFormsLayout(props);
const layoutCommon = useLayoutCommon(layoutProps);

const { appliedOptions } = layoutCommon;

const { layout } = layoutProps;

const isToggleable = computed(() => !!appliedOptions.value.isToggleable);

const accordionIndexForExpansion = computed(() => {
    return !!appliedOptions.value.isExpanded ? 0 : undefined;
});
</script>
