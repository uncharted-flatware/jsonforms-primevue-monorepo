<template>
    <If v-if="asAccordion">
        <Accordion v-if="layout.visible" :value="accordionValueForExpansion" class="jsonforms-layout">
            <AccordionPanel value="0">
                <AccordionHeader>{{ layout.label }}</AccordionHeader>
                <AccordionContent>
                    <div class="flex flex-column align-content-start gap-3">
                        <LayoutElementsDispatcher v-bind="{ ...props }" />
                    </div>
                </AccordionContent>
            </AccordionPanel>
        </Accordion>
    </If>
    <Else v-else>
        <Panel
            v-if="layout.visible"
            :header="layout.label"
            :toggleable="isToggleable"
            :collapsed="isCollapsed"
            class="group-panel jsonforms-layout"
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
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
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
const isCollapsed = computed(() => appliedOptions.value.isExpanded === false);
const widthOption = computed(() => appliedOptions.value.width || 'auto');

const accordionValueForExpansion = computed(() => {
    return appliedOptions.value.isExpanded !== false ? ['0'] : [];
});
</script>

<style scoped>
.group-panel {
    margin-bottom: 1rem;
}

:deep(.p-panel-header) {
    background: var(--surface-50);
    border: 1px solid var(--surface-border);
    border-bottom: none;
    border-radius: 6px 6px 0 0;
    font-weight: 600;
    font-size: var(--text-size-small, 0.875rem);
    padding: 0.75rem 1rem;
}

:deep(.p-panel-content) {
    border: 1px solid var(--surface-border);
    border-radius: 0 0 6px 6px;
    padding: 1rem;
    background: var(--surface-0);
    overflow: visible;
    position: relative;
    z-index: 1;
}

:deep(.p-panel-toggle-icon) {
    color: var(--text-color-secondary);
}

:deep(.p-accordion-header) {
    font-weight: 600;
    font-size: var(--text-size-small, 0.875rem);
}

:deep(.p-accordion-content) {
    padding: 1rem;
}

/* Ensure input controls have borders */
:deep(.p-inputnumber),
:deep(.p-inputtext),
:deep(.p-select),
:deep(.p-calendar),
:deep(.p-datepicker) {
    border: 1px solid var(--surface-border) !important;
    border-radius: 4px;
}

:deep(.p-inputtext) {
    padding: 0.5rem 0.75rem !important;
    background: var(--surface-0, #ffffff) !important;
    width: 100%;
}

:deep(.p-inputnumber-input) {
    border: none;
    border-radius: 4px 0 0 4px;
}

:deep(.p-inputnumber-buttons-stacked .p-inputnumber-button-group) {
    border-left: 1px solid var(--surface-border);
}

:deep(.p-inputnumber-button) {
    border: none;
    height: 50%;
}

:deep(.p-inputnumber-button:first-child) {
    border-bottom: 0.5px solid var(--surface-border);
}

/* Ensure dropdowns and overlays are visible */
:deep(.p-select-overlay),
:deep(.p-select-overlay-panel),
:deep(.p-dropdown-panel),
:deep(.p-overlay) {
    z-index: 9999 !important;
}
</style>

<!-- 
  Note: Global unscoped styles removed to prevent style pollution.
  Overlays now inherit from parent app's PrimeVue theme.
-->
