<template>
    <If v-if="isToggleable">
        <Accordion v-if="layout.visible" :activeIndex="accordionIndexForExpansion">
            <AccordionTab :header="layout.label">
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
            </AccordionTab>
        </Accordion>
    </If>
    <Else v-else>
        <Panel
            v-if="layout.visible"
            :header="layout.label"
            :toggleable="isToggleable"
        >
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
        </Panel>
    </Else>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import { DispatchRenderer, type RendererProps, rendererProps, useJsonFormsLayout } from "@jsonforms/vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Panel from "primevue/panel";
import { type Layout } from "@jsonforms/core";
import { useLayoutCommon } from "../util/composition";
import If from "../components/If.vue";
import For from "../components/For.vue";
import Else from "../components/Else.vue";

const layoutRenderer = defineComponent({
    name: 'group-renderer',
    components: {
        Accordion,
        AccordionTab,
        DispatchRenderer,
        Panel,
        If,
        For,
        Else
    },
    props: {
        ...rendererProps<Layout>()
    },
    setup(props: RendererProps<Layout>) {
        return useLayoutCommon(useJsonFormsLayout(props));
    },
    computed: {
        isToggleable(): boolean {
            return !!this.appliedOptions.isToggleable;
        },
        accordionIndexForExpansion(): number | undefined {
            return !!this.appliedOptions.isExpanded ? 0 : undefined;
        }
    }
});

export default layoutRenderer;
</script>
