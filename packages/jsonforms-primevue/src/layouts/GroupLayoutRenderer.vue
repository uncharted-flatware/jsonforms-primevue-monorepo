<template>
    <If v-if="asAccordion">
        <Accordion v-if="layout.visible" :activeIndex="accordionIndexForExpansion">
            <AccordionTab :header="layout.label">
                <div class="flex flex-column align-content-start gap-3">
                    <LayoutElementsDispatcher v-bind="{ ...props }" />
                </div>
            </AccordionTab>
        </Accordion>
    </If>
    <Else v-else>
        <Panel
            v-if="layout.visible"
            :header="layout.label"
            :toggleable="isToggleable"
            :collapsed="isCollapsed"
        >
            <div class="flex flex-column align-content-start gap-3">
                <LayoutElementsDispatcher v-bind="{ ...props }" />
            </div>
        </Panel>
    </Else>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Panel from "primevue/panel";
import { type Layout } from "@jsonforms/core";
import { useLayoutCommon } from "../util/composition";
import { If, Else } from "../components/blocks";
import LayoutElementsDispatcher from "./LayoutElementsDispatcher.vue";

const props = defineProps(rendererProps<Layout>());
const layoutProps = useJsonFormsLayout(props);
const layoutCommon = useLayoutCommon(layoutProps);

const { appliedOptions, layout } = layoutCommon;

const asAccordion = computed(() => appliedOptions.value.asAccordion);
const isToggleable = computed(() => !!appliedOptions.value.isToggleable);
const isCollapsed = computed(() => !appliedOptions.value.isExpanded);

const accordionIndexForExpansion = computed(() => {
    return !!appliedOptions.value.isExpanded ? 0 : undefined;
});
</script>
