<template>
  <div class="jsonforms-stack">
    <DispatchRenderer
      :schema="props.schema"
      :uischema="effectiveUiSchema"
      :path="props.path"
      :enabled="props.enabled"
      :renderers="props.renderers"
      :cells="props.cells"
      :data="props.data"
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type JsonSchema, type UISchemaElement, type JsonFormsRendererRegistryEntry, type JsonFormsCellRendererRegistryEntry } from '@jsonforms/core';
import { DispatchRenderer } from '@jsonforms/vue';

const props = defineProps({
  schema: {
    type: Object as () => JsonSchema,
    required: true
  },
  uischema: {
    type: Object as () => UISchemaElement,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  renderers: {
    type: Array as () => JsonFormsRendererRegistryEntry[],
    required: true
  },
  cells: {
    type: Array as () => JsonFormsCellRendererRegistryEntry[],
    required: true
  },
  data: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits<{
  change: [event: { data: any }]
}>();

const effectiveUiSchema = computed(() => {
  if (props.uischema && props.uischema.type !== 'Control') {
    const uischema = { ...props.uischema } as any;
    if (props.readonly) {
      addDisplayOnlyOption(uischema);
    }
    return uischema;
  }
  
  const baseSchema = {
    type: 'Control' as const,
    scope: '#',
    options: {
      ...(props.uischema as any)?.options
    }
  };
  
  if (props.readonly) {
    baseSchema.options.displayOnly = true;
    if ((props.uischema as any)?.options?.compact) {
      baseSchema.options.compact = true;
    }
  }
  
  return baseSchema;
});

const addDisplayOnlyOption = (uischema: any) => {
  if (uischema.type === 'Control') {
    uischema.options = uischema.options || {};
    uischema.options.displayOnly = true;
    if ((props.uischema as any)?.options?.compact) {
      uischema.options.compact = true;
    }
  } else if (uischema.elements && Array.isArray(uischema.elements)) {
    uischema.elements.forEach((element: any) => addDisplayOnlyOption(element));
  }
};

const handleChange = (event: any) => {
  let newValue;
  
  if (event && typeof event === 'object' && 'data' in event) {
    newValue = event.data;
  } else {
    newValue = event;
  }
  
  emit('change', { data: newValue });
};
</script>
