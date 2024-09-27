# jsonforms-primvevue

## Motivation

The JSONForms.io packages include integrations for vanilla HTML and Veutify, but we need PrimeVue.
This first version depends on PrimeVue 3.
(Note PrimeVue 4 has breaking changes.)

## Installation

```bash
yarn add @unchartedsoftware/jsonforms-primevue primevue@3.50.0 ... TODO: List the other peer dependencies
```

## Usage

A runnable [example playground](./example/playground/README.md) application for live editing is available.
Import and add the ranked renderer configurations and supply them to the JSON Forms component. i.e.:

```typescript vuejs
<script lang="ts">
import { JsonForms } from "@jsonforms/vue";
import primeVueRenderers from "jsonforms-primevue";

// defineComponent(...

</script>    
    
<template>
    <JsonForms
        :data="exampleData"
        :renderers="primeVueRenderers"
        :schema="dataSchema"
        :uischema="uiSchema"
        @change="onFormChanged" 
    /> 
</template>
```

## Roadmap / TODO

 - [ ] Basic controls for all types
   - [ ] String input 
   - [ ] Number Input
     - [ ] Min/Max range support 
     - [ ] Step support
     - [ ] Prefix/Suffix support
   - [ ] Integer Input
     - [ ] Min/Max range support
     - [ ] Step support
     - [ ] Prefix/Suffix support
   - [ ] Enum 
   - [ ] Boolean (checkbox)
   - [ ] Date
   - [ ] Date-Time
   - [ ] Label placement options (float | north | south | east | west) ?
   - [ ] Description display & options (onfocus | always | tooltip)
 - [ ] Group Layout renderer (with toggleable option to render as an accordion)
 - [ ] HorizontalLayout / VerticalLayout styling
 - [ ] Error / invalid state feedback
