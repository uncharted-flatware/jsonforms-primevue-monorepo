<template>
  <div v-if="control.visible">
    <DispatchRenderer
      :enabled="control.enabled"
      :schema="control.schema"
      :uischema="detailUiSchema"
      :path="control.path"
      :renderers="control.renderers"
      :cells="control.cells"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ControlElement, type JsonSchema, type GroupLayout, findUISchema, Generate } from '@jsonforms/core';
import { rendererProps, DispatchRenderer, useJsonFormsControlWithDetail } from '@jsonforms/vue';
import { useControlCommon } from '../util/composition';
import isEmpty from 'lodash/isEmpty';

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControlWithDetail(props);
const controlCommon = useControlCommon(controlProps);

const {
  control
} = controlCommon;

const detailUiSchema = computed(() => {
  const uiSchemaGenerator = () => {
    const uiSchema = Generate.uiSchema(
      control.value.schema,
      'Group',
      undefined,
      control.value.rootSchema,
    );
    if (isEmpty(control.value.path)) {
      uiSchema.type = 'VerticalLayout';
    } else {
      (uiSchema as GroupLayout).label = control.value.label;
    }
    return uiSchema;
  };

  let result = findUISchema(
    control.value.uischemas,
    control.value.schema,
    control.value.uischema.scope,
    control.value.path,
    uiSchemaGenerator,
    control.value.uischema,
    control.value.rootSchema,
  );

  return result;
});

</script> 