<template>
    <div v-if="visible" :id="id" class="flex align-items-center gap-4">
        <If v-if="appliedOptions.labelPlacement === 'float'">
            <FloatLabel>
                <slot></slot>
                <label :for="id + '-input'" class="flex align-items-center gap-1">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="p-info-icon" v-tooltip="description">
                        <InfoCircle class="text-primary cursor-pointer" />
                    </span>
                </label>
            </FloatLabel>
        </If>
        <ElseIf v-else-if="appliedOptions.labelPlacement === 'right'">
            <slot></slot>
            <If v-if="label">
                <label :for="id + '-input'" class="flex align-items-center gap-1">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="p-info-icon" v-tooltip="description">
                        <InfoCircle class="text-primary cursor-pointer" />
                    </span>
                </label>
            </If>
        </ElseIf>
        <Else v-else>
            <If v-if="label">
                <label :for="id + '-input'" class="flex align-items-center gap-1">
                    {{ label }}
                    <span v-if="showDescriptionIcon" :id="id + '-info'" class="p-info-icon" v-tooltip="description">
                        <InfoCircle class="text-primary cursor-pointer" />
                    </span>
                </label>
            </If>
            <slot></slot>
        </Else>
        
        <!-- Always display description -->
        <div v-if="showAlwaysDescription" class="w-full text-sm text-gray-600 mt-1">
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
import InfoCircle from 'primevue/icons/infocircle';

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

    // styles: {
    //     required: true,
    //     type: Object as PropType<Styles>,
    // }
});

// Computed properties for description display
const descriptionDisplayMode = computed(() => 
    props.appliedOptions?.descriptionDisplay || 'tooltip'
);

const showDescriptionIcon = computed(() => 
    descriptionDisplayMode.value === 'tooltip' && props.description
);

const showAlwaysDescription = computed(() => 
    descriptionDisplayMode.value === 'always' && props.description
);
</script>

<style>
.p-info-icon {
    display: inline-flex;
    align-items: center;
}
</style>
