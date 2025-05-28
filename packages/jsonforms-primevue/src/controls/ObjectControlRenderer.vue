<template>
  <ControlWrapper
    v-bind="controlWrapper"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <div class="flex flex-column gap-1 p-3 border-1 border-300 border-round">
      <div v-for="property in objectProperties" :key="property.name" class="flex flex-column gap-1">
        <DispatchRenderer
          :schema="property.schema"
          :uischema="property.uischema"
          :path="`${control.path}.${property.name}`"
          :enabled="control.enabled && !appliedOptions.displayOnly"
          :renderers="control.renderers"
          :cells="control.cells"
          :data="getPropertyValue(property.name)"
          @change="handlePropertyChange(property.name)"
          :readonly="!control.enabled || appliedOptions.displayOnly"
        />
      </div>
    </div>
  </ControlWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ControlElement, type JsonSchema } from '@jsonforms/core';
import { rendererProps, useJsonFormsControl, DispatchRenderer } from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from '../util/composition';

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControl(props);
const controlCommon = useControlCommon(controlProps);

const {
  appliedOptions,
  control,
  controlWrapper,
  isFocused,
  onChange
} = controlCommon;

// Extract object properties from schema
const objectProperties = computed(() => {
  const schema = control.value.schema as JsonSchema;
  const properties = schema.properties || {};
  
  return Object.entries(properties).map(([name, propertySchema]) => ({
    name,
    schema: propertySchema as JsonSchema,
    uischema: {
      type: 'Control' as const,
      scope: `#/properties/${name}`,
      label: (propertySchema as JsonSchema).title || name,
      options: (appliedOptions.value.displayOnly ? { displayOnly: true, compact: true } : {})
    }
  }));
});

// Get property value from the current data
const getPropertyValue = (propertyName: string) => {
  return control.value.data?.[propertyName];
};

// Handle property changes
const handlePropertyChange = (propertyName: string) => (event: any) => {
  let newValue;
  if (event && typeof event === 'object' && 'data' in event) {
    newValue = event.data;
  } else {
    newValue = event;
  }
  
  // Update the specific property in the object
  const currentData = control.value.data || {};
  const newData = {
    ...currentData,
    [propertyName]: newValue
  };
  
  onChange(newData);
};
</script> 