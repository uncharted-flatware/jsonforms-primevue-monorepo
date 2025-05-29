<template>
  <ControlWrapper
    v-bind="controlWrapper"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <div :class="appliedOptions.displayOnly ? 'flex flex-column gap-1' : 'flex flex-column gap-3'">
      <div class="flex justify-content-end" v-if="control.enabled && !appliedOptions.displayOnly && !appliedOptions.displayAsTable">
        <div class="flex gap-2">
          <Button
            :disabled="!control.enabled"
            @click="addItem"
            v-tooltip.top="'Add Item'"
            class="p-button-sm"
          >
            <i class="pi pi-plus"></i>
          </Button>
        </div>
      </div>
      
      <div v-if="!control.data || control.data.length === 0" class="text-500 text-center p-3">
        {{ appliedOptions.emptyMessage || 'No items found' }}
      </div>

      <!-- Table Display Mode -->
      <div v-else-if="appliedOptions.displayAsTable && !isPrimitiveArray" class="flex flex-column gap-2">
        <DataTable 
          :value="control.data"
          :resizableColumns="true"
          :tableStyle="{ minWidth: '50rem' }"
          class="p-datatable-sm"
        >
          <!-- Action column for non-displayOnly mode -->
          <Column v-if="!appliedOptions.displayOnly" header="Actions" :style="{ width: '10rem' }" frozen alignFrozen="right">
            <template #body="{ index }">
              <div class="flex gap-1">
                <template v-if="appliedOptions.showSortButtons">
                  <Button
                    @click="moveItem(index, index - 1)"
                    :disabled="index === 0"
                    v-tooltip.top="'Move Up'"
                    class="p-button-sm"
                    text
                    severity="secondary"
                  >
                    <i class="pi pi-chevron-up"></i>
                  </Button>
                  <Button
                    @click="moveItem(index, index + 1)"
                    :disabled="index === control.data.length - 1"
                    v-tooltip.top="'Move Down'"
                    class="p-button-sm"
                    text
                    severity="secondary"
                  >
                    <i class="pi pi-chevron-down"></i>
                  </Button>
                </template>
                <Button
                  @click="removeItem(index)"
                  v-tooltip.top="'Remove Item'"
                  class="p-button-sm"
                  severity="danger"
                  text
                >
                  <i class="pi pi-trash"></i>
                </Button>
              </div>
            </template>
          </Column>

          <!-- Dynamic columns based on object properties -->
          <Column 
            v-for="property in tableColumns" 
            :key="property.key"
            :field="property.key"
            :header="property.header"
            :style="{ minWidth: '12rem' }"
          >
            <template #body="{ data, index }">
              <div style="border: 1px solid red; padding: 2px; margin: 1px;">
                <div style="font-size: 10px; color: red;">
                  DEBUG: {{ property.key }} - HasEnum: {{ !!property.schema.enum }} | EnumValues: {{ property.schema.enum }}
                </div>
                <DispatchRenderer
                  :schema="property.schema"
                  :uischema="{ 
                    type: 'Control', 
                    scope: '#',
                    options: { 
                      ...(appliedOptions.displayOnly ? { displayOnly: true } : {}),
                      compact: true,
                      labelPlacement: 'hide'
                    }
                  } as ControlElement"
                  :path="`${composePaths(control.path, `${index}`)}.${property.key}`"
                  :enabled="control.enabled && !appliedOptions.displayOnly"
                  :renderers="control.renderers"
                  :cells="control.cells"
                  :data="data[property.key]"
                  @change="handleCellChange(index, property.key)"
                  class="w-full"
                />
              </div>
            </template>
          </Column>
        </DataTable>

        <!-- Add button for table mode -->
        <div class="flex justify-content-start" v-if="control.enabled && !appliedOptions.displayOnly">
          <Button
            :disabled="!control.enabled"
            @click="addItem"
            v-tooltip.top="'Add Item'"
            class="p-button-sm"
          >
            <i class="pi pi-plus mr-1"></i>
            Add Row
          </Button>
        </div>
      </div>

      <!-- Simple display for primitive arrays in displayOnly mode -->
      <div v-else-if="appliedOptions.displayOnly && isPrimitiveArray" class="flex flex-column gap-1">
        <div 
          v-for="(item, index) in control.data" 
          :key="`${control.path}-${index}`" 
          class="flex align-items-center gap-1"
        >
          <i class="pi pi-circle-fill text-300" style="font-size: 0.4rem;"></i>
          <div class="flex-1">
            <DispatchRenderer
              :schema="itemSchema"
              :uischema="{ type: 'Control', scope: '#', options: { displayOnly: true, compact: true, labelPlacement: appliedOptions.labelPlacement } } as any"
              :path="composePaths(control.path, `${index}`)"
              :enabled="false"
              :renderers="control.renderers"
              :cells="control.cells"
              :data="item"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Compact display for object arrays in displayOnly mode -->
      <div v-else-if="appliedOptions.displayOnly" class="flex flex-column gap-2">
        <div 
          v-for="(item, index) in control.data" 
          :key="`${control.path}-${index}`" 
          class="border-1 border-300 border-round p-2"
        >
          <!-- Item content with compact spacing -->
          <ArrayItemRenderer
            :schema="itemSchema"
            :uischema="getItemUiSchema()"
            :path="composePaths(control.path, `${index}`)"
            :enabled="false"
            :renderers="control.renderers"
            :cells="control.cells"
            :data="item"
            :readonly="true"
          />
        </div>
      </div>

      <!-- Complex display mode for objects or non-displayOnly mode -->
      <div v-else class="flex flex-column gap-3">
        <div 
          v-for="(item, index) in control.data" 
          :key="`${control.path}-${index}`" 
          class="border-1 border-300 border-round p-3"
        >
          <!-- Item header with label and controls -->
          <div class="flex justify-content-between align-items-center mb-2">
            <div class="flex align-items-center gap-2">
              <span class="font-semibold text-900">
                {{ getItemLabel(item, index) }}
              </span>
            </div>
            <!-- Action buttons, only visible if editable -->
            <div class="flex gap-1" v-if="control.enabled && !appliedOptions.displayOnly">
              <!-- Sort buttons -->
              <template v-if="appliedOptions.showSortButtons">
                <Button
                  @click="moveItem(index, index - 1)"
                  :disabled="index === 0"
                  v-tooltip.top="'Move Up'"
                  class="p-button-sm"
                  text
                  severity="secondary"
                >
                  <i class="pi pi-chevron-up"></i>
                </Button>
                <Button
                  @click="moveItem(index, index + 1)"
                  :disabled="index === control.data.length - 1"
                  v-tooltip.top="'Move Down'"
                  class="p-button-sm"
                  text
                  severity="secondary"
                >
                  <i class="pi pi-chevron-down"></i>
                </Button>
              </template>
              <!-- Remove button -->
              <Button
                @click="removeItem(index)"
                v-tooltip.top="'Remove Item'"
                class="p-button-sm"
                severity="danger"
                text
              >
                <i class="pi pi-trash"></i>
              </Button>
            </div>
          </div>

          <!-- Item content -->
          <ArrayItemRenderer
            :schema="itemSchema"
            :uischema="getItemUiSchema()"
            :path="composePaths(control.path, `${index}`)"
            :enabled="control.enabled && !appliedOptions.displayOnly"
            :renderers="control.renderers"
            :cells="control.cells"
            :data="item"
            @change="handleItemChange(index)"
            :readonly="!control.enabled || appliedOptions.displayOnly"
          />
        </div>
      </div>
    </div>
  </ControlWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ControlElement, type JsonSchema, type UISchemaElement } from '@jsonforms/core';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useControlCommon } from '../util/composition';
import { composePaths } from '@jsonforms/core';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ArrayItemRenderer from './ArrayItemRenderer.vue';
import get from 'lodash/get';
import { DispatchRenderer } from '@jsonforms/vue';

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

// Check if the array contains primitive values (string, number, boolean)
const isPrimitiveArray = computed(() => {
  const itemSchemaValue = itemSchema.value;
  return itemSchemaValue?.type === 'string' || 
         itemSchemaValue?.type === 'number' || 
         itemSchemaValue?.type === 'integer' || 
         itemSchemaValue?.type === 'boolean';
});

// Generate table columns from object schema properties
const tableColumns = computed(() => {
  const schema = itemSchema.value;
  
  if (!schema || !schema.properties) {
    return [];
  }
  
  const columns = Object.entries(schema.properties).map(([name, propertySchema]) => {
    const typedSchema = propertySchema as JsonSchema;
    console.debug('Table column schema:', { name, schema: typedSchema, hasEnum: !!typedSchema.enum, enumValues: typedSchema.enum });
    
    return {
      key: name,
      header: typedSchema.title || name,
      schema: typedSchema
    };
  });
  
  return columns;
});

// Handle cell changes from DispatchRenderer
const handleCellChange = (rowIndex: number, propertyKey: string) => (event: any) => {
  console.debug('Cell change:', { rowIndex, propertyKey, event });
  
  let newPropertyValue;
  if (event && typeof event === 'object' && 'data' in event) {
    newPropertyValue = event.data;
  } else {
    newPropertyValue = event;
  }
  
  const newData = [...(control.value.data || [])];
  if (newData[rowIndex]) {
    // Update just the specific property in the row object
    newData[rowIndex] = {
      ...newData[rowIndex],
      [propertyKey]: newPropertyValue
    };
    onChange(newData);
  }
};

// Format cell values for display (still used for display-only mode)
const formatCellValue = (value: any, schema: JsonSchema) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (schema.type === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (schema.type === 'number' || schema.type === 'integer') {
    return typeof value === 'number' ? value.toString() : value;
  }
  
  if (schema.type === 'string') {
    return value.toString();
  }
  
  if (Array.isArray(value)) {
    return `[${value.length} items]`;
  }
  
  if (typeof value === 'object') {
    return '[Object]';
  }
  
  return value.toString();
};

// Get the label for an array item based on elementLabelProp option
const getItemLabel = (item: any, index: number) => {
  const elementLabelProp = appliedOptions.value.elementLabelProp;
  
  if (elementLabelProp && item && typeof item === 'object') {
    const labelValue = get(item, elementLabelProp);
    if (labelValue !== undefined && labelValue !== null) {
      return String(labelValue);
    }
  }
  
  // Fallback to first primitive property if no elementLabelProp specified
  if (item && typeof item === 'object') {
    for (const [key, value] of Object.entries(item)) {
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
      }
    }
  }
  
  // Generic label
  return `Item ${index + 1}`;
};

// Generate UI schema for array items based on detail option
const getItemUiSchema = (): UISchemaElement => {
  const detailOption = appliedOptions.value.detail;
  
  if (detailOption && typeof detailOption === 'object') {
    // Inline UI schema provided
    return detailOption;
  }
  
  if (typeof detailOption === 'string') {
    const detailType = detailOption.toUpperCase();
    
    if (detailType === 'GENERATED') {
      // Generate UI schema based on item schema properties
      return generateUiSchemaFromItemSchema();
    }
    
    if (detailType === 'REGISTERED') {
      // Check for registered UI schema for this type
      const registeredUiSchema = control.value.renderers.find(
        (r: any) => r.tester && r.tester(control.value.schema, control.value.uischema)
      ) as { uischema?: UISchemaElement };
      
      if (registeredUiSchema?.uischema) {
        return registeredUiSchema.uischema;
      }
      
      // Fallback to generated if no registered schema found
      return generateUiSchemaFromItemSchema();
    }
    
    if (detailType === 'DEFAULT') {
      // Simple control without any special detail view
      return {
        type: 'Control',
        scope: '#'
      } as any;
    }
  }
  
  // Default: simple control
  return {
    type: 'Control',
    scope: '#'
  } as any;
};

// Generate a UI schema from the item schema properties
const generateUiSchemaFromItemSchema = (): UISchemaElement => {
  const schema = itemSchema.value;
  
  if (!schema || !schema.properties) {
    return {
      type: 'Control',
      scope: '#'
    } as any;
  }
  
  // Create a vertical layout with controls for each property
  return {
    type: 'VerticalLayout',
    elements: Object.entries(schema.properties).map(([name, propSchema]) => ({
      type: 'Control',
      scope: `#/properties/${name}`,
      label: (propSchema as JsonSchema).title || name,
      options: {
        ...(appliedOptions.value.displayOnly ? { displayOnly: true, compact: true } : {}),
        labelPlacement: appliedOptions.value.labelPlacement
      }
    }))
  } as any;
};

// Add a new item to the array
const addItem = () => {
  const itemSchemaValue = control.value.schema.items as JsonSchema;
  let defaultValue: any = null;
  
  // Provide appropriate default values based on item type
  if (itemSchemaValue?.type === 'string') {
    defaultValue = '';
  } else if (itemSchemaValue?.type === 'number' || itemSchemaValue?.type === 'integer') {
    defaultValue = 0;
  } else if (itemSchemaValue?.type === 'boolean') {
    defaultValue = false;
  } else if (itemSchemaValue?.type === 'array') {
    defaultValue = [];
  } else if (itemSchemaValue?.type === 'object') {
    // Create object with default values for required properties
    defaultValue = {};
    if (itemSchemaValue.properties) {
      Object.entries(itemSchemaValue.properties).forEach(([key, propSchema]: [string, any]) => {
        if (propSchema.default !== undefined) {
          defaultValue[key] = propSchema.default;
        } else if (propSchema.type === 'string') {
          defaultValue[key] = '';
        } else if (propSchema.type === 'number' || propSchema.type === 'integer') {
          defaultValue[key] = 0;
        } else if (propSchema.type === 'boolean') {
          defaultValue[key] = false;
        }
      });
    }
  }
  
  // Ensure we have an array to work with
  const currentData = control.value.data || [];
  const newData = [...currentData, defaultValue];
  onChange(newData);
};

// Remove an item
const removeItem = (index: number) => {
  const newData = [...(control.value.data || [])];
  newData.splice(index, 1);
  onChange(newData);
};

// Move an item to a new position
const moveItem = (fromIndex: number, toIndex: number) => {
  if (toIndex < 0 || toIndex >= control.value.data.length) {
    return;
  }
  
  const newData = [...(control.value.data || [])];
  const [movedItem] = newData.splice(fromIndex, 1);
  newData.splice(toIndex, 0, movedItem);
  onChange(newData);
};

// Update an item's value
const updateItem = (index: number, value: any) => {
  console.debug('ArrayControlRenderer updateItem:', { index, value, currentData: control.value.data });
  
  const newData = [...(control.value.data || [])];
  newData[index] = value;
  
  console.debug('ArrayControlRenderer updating to:', newData);
  onChange(newData);
};

// Handle change events from ArrayItemRenderer
const handleItemChange = (index: number) => (event: any) => {
  console.debug('ArrayControlRenderer handleItemChange:', { index, event });
  
  let newValue;
  if (event && typeof event === 'object' && 'data' in event) {
    newValue = event.data;
  } else {
    newValue = event;
  }
  
  updateItem(index, newValue);
};

// Ensure schema is properly typed
const itemSchema = computed(() => control.value.schema.items as JsonSchema);
</script> 