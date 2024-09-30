<template>
    <div v-if="visible" :id="id" class="flex align-items-center gap-3">
        <If v-if="labelPlacement === 'float'">
            <FloatLabel>
                <slot></slot>
                <label :for="id + '-input'">{{ label }}</label>
            </FloatLabel>
        </If>
        <Else>
            <label :for="id + '-input'">{{ label }}</label>
            <slot></slot>
        </Else>
    </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { Options } from '../util/options';
import { If, Else, ElseIf } from '../components/blocks';

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

const labelPlacement = computed(() => {
    return props.appliedOptions?.labelPlacement ?? 'left';
});

</script>
