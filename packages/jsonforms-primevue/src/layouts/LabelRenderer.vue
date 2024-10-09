<template>
    <If v-if="label.visible">
        <If v-if="hasImage">
            <Card class="flex flex-column align-items-center gap-2">
                <template #content>
                    <img
                        :src="imageUrl"
                        :alt="label.text"
                        :width="width"
                        :height="height"
                        :style="imageStyle"
                    />
                    <label>{{ label.text }}</label>
                </template>
            </Card>
        </If>
        <Else v-else>
            <label>{{ label.text }}</label>
        </Else>
    </If>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { rendererProps, useJsonFormsLabel } from "@jsonforms/vue";
import Card from 'primevue/card';
import { type LabelElement } from "@jsonforms/core";
import { useLabelCommon } from "../util/composition";
import { If, Else } from "../components/blocks";

const props = defineProps(rendererProps<LabelElement>());
const labelProps = useJsonFormsLabel(props);
const labelCommon = useLabelCommon(labelProps);

const { label, appliedOptions } = labelCommon;

const hasImage = computed(() => !!appliedOptions.value.imageUrl);
const imageUrl = computed(() => appliedOptions.value.imageUrl);
const width = computed(() => appliedOptions.value.imageWidth);
const height = computed(() => appliedOptions.value.imageHeight);
const imageStyle = computed(() => {
    let style = '{';
    if (width.value) {
        style += `${width.value}px; `
    }
    if (height.value) {
        style += `${height.value}px;`;
    }
    style += '}';
    return style;
});

</script>
