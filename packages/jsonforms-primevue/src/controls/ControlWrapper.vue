<template>
    <div 
        v-if="visible" 
        :id="id" 
        :class="containerClasses"
    >
        <If v-if="appliedOptions.labelPlacement === 'float'">
            <FloatLabel>
                <div class="jsonforms-control__widget">
                    <slot></slot>
                </div>
                <label :for="id + '-input'" class="jsonforms-control__label">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="jsonforms-control__info" v-tooltip="description">
                        <InfoCircle />
                    </span>
                </label>
            </FloatLabel>
        </If>
        <ElseIf v-else-if="appliedOptions.labelPlacement === 'top'">
            <If v-if="label">
                <label :for="id + '-input'" class="jsonforms-control__label">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="jsonforms-control__info" v-tooltip="description">
                        <InfoCircle />
                    </span>
                </label>
            </If>
            <div class="jsonforms-control__widget">
                <slot></slot>
            </div>
        </ElseIf>
        <ElseIf v-else-if="appliedOptions.labelPlacement === 'right'">
            <div class="jsonforms-control__widget">
                <slot></slot>
            </div>
            <If v-if="label">
                <label :for="id + '-input'" class="jsonforms-control__label">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="jsonforms-control__info" v-tooltip="description">
                        <InfoCircle />
                    </span>
                </label>
            </If>
        </ElseIf>
        <ElseIf v-else-if="appliedOptions.labelPlacement === 'hide'">
            <div class="jsonforms-control__widget">
                <slot></slot>
            </div>
        </ElseIf>
        <Else v-else>
            <If v-if="label">
                <label :for="id + '-input'" class="jsonforms-control__label">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="jsonforms-control__info" v-tooltip="description">
                        <InfoCircle />
                    </span>
                </label>
            </If>
            <div class="jsonforms-control__widget">
                <slot></slot>
            </div>
        </Else>
        
        <div v-if="showAlwaysDescription" class="jsonforms-control__description">
            {{ description }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PropType } from 'vue';
import type { Options } from '../util/options';
import { If, Else, ElseIf } from '../components/blocks';
import FloatLabel from 'primevue/floatlabel';
import InfoCircle from '@primevue/icons/infocircle';

const props = defineProps({
    id: {
        required: true,
        type: String,
    },
    description: {
        required: false as const,
        type: String,
        default: undefined,
    },
    errors: {
        required: false as const,
        type: String,
        default: undefined,
    },
    label: {
        required: false as const,
        type: String,
        default: undefined,
    },
    appliedOptions: {
        required: false as const,
        type: Object as PropType<Options>,
        default: undefined,
    },
    visible: {
        required: false as const,
        type: Boolean,
        default: true,
    },
    required: {
        required: false as const,
        type: Boolean,
        default: false,
    },
    isFocused: {
        required: false as const,
        type: Boolean,
        default: false,
    },
});

const descriptionDisplayMode = computed(() => 
    props.appliedOptions?.descriptionDisplay || 'tooltip'
);

const showDescriptionIcon = computed(() => 
    descriptionDisplayMode.value === 'tooltip' && props.description
);

const showAlwaysDescription = computed(() => 
    descriptionDisplayMode.value === 'always' && props.description
);

const containerClasses = computed(() => {
    const labelPlacement = props.appliedOptions?.labelPlacement;
    const layout = props.appliedOptions?.layout;
    const baseClasses = ['jsonforms-control'];

    if (labelPlacement === 'top') {
        baseClasses.push('jsonforms-control--label-top');
    } else if (labelPlacement === 'float' || labelPlacement === 'hide') {
        // default block layout
    } else if (layout === 'space-between') {
        baseClasses.push('jsonforms-control--layout-between');
    } else {
        baseClasses.push('jsonforms-control--label-inline');
    }

    return baseClasses.join(' ');
});
</script>
