<template>
    <div v-if="visible" :id="id">
        <label
            :for="id + '-input'"
        >
            <span>LABEL</span>{{ label }}
        </label>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Options } from '../util/options';

export default defineComponent({
    name: 'control-wrapper',
    props: {
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
    }
});
</script>
