<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useJsonFormsPrimeVueIcons } from './context';
import type { JsonFormsPrimeVueIconName } from './types';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  name: JsonFormsPrimeVueIconName;
  ariaLabel?: string;
}>();

const attrs = useAttrs();
const icons = useJsonFormsPrimeVueIcons();
const iconComponent = computed(() => icons.value[props.name]);
</script>

<template>
  <span
    class="jsonforms-icon"
    v-bind="attrs"
    :aria-label="ariaLabel"
    :aria-hidden="ariaLabel ? undefined : true"
  >
    <component :is="iconComponent" />
  </span>
</template>
