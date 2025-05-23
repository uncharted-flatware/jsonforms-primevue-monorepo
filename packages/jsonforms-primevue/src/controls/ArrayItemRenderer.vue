<template>
  <div class="flex flex-column gap-2 w-full">
    <DispatchRenderer
      :schema="props.schema"
      :uischema="effectiveUiSchema"
      :path="props.path"
      :enabled="props.enabled"
      :renderers="props.renderers"
      :cells="props.cells"
      :data="props.data"
      @change="handleChange"
      class="w-full"
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

// Use the provided UI schema, or create a simple control as fallback
const effectiveUiSchema = computed(() => {
  // If we have a custom UI schema (not just a simple control), use it as-is
  if (props.uischema && props.uischema.type !== 'Control') {
    const uischema = { ...props.uischema } as any;
    if (props.readonly) {
      // Add displayOnly option to all controls
      addDisplayOnlyOption(uischema);
    }
    return uischema;
  }
  
  // For simple controls or fallback, create a basic control
  const baseSchema = {
    type: 'Control' as const,
    scope: '#',
    options: {
      ...((props.uischema as any)?.options || {})
    }
  };
  
  if (props.readonly) {
    baseSchema.options.displayOnly = true;
  }
  
  return baseSchema;
});

// Add displayOnly option to UI schema
const addDisplayOnlyOption = (uischema: any) => {
  if (uischema.type === 'Control') {
    uischema.options = uischema.options || {};
    uischema.options.displayOnly = true;
  } else if (uischema.elements && Array.isArray(uischema.elements)) {
    uischema.elements.forEach((element: any) => addDisplayOnlyOption(element));
  }
};

const handleChange = (event: any) => {
  // Handle different possible event structures from DispatchRenderer
  let newValue;
  
  if (event && typeof event === 'object' && 'data' in event) {
    // Standard JsonForms change event: { data: value, errors: [...] }
    newValue = event.data;
  } else {
    // Direct value
    newValue = event;
  }
  
  console.log('ArrayItemRenderer change:', { event, newValue, path: props.path });
  emit('change', { data: newValue });
};

// Debug logging when component is mounted (remove in production)
// console.log('ArrayItemRenderer mounted:', {
//   path: props.path,
//   data: props.data,
//   uischema: props.uischema,
//   schema: props.schema,
//   effectiveUiSchema: effectiveUiSchema.value
// });
</script> 