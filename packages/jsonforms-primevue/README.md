# jsonforms-primevue

## Motivation

The JSONForms.io packages include integrations for vanilla HTML and Veutify, but we need PrimeVue.
This first version depends on PrimeVue 3.
(Note PrimeVue 4 has breaking changes.)

## Installation

```bash
yarn add @unchartedsoftware/jsonforms-primevue @jsonforms/core @jsonforms/vue primevue@3.50.0 primeflex
```

## Usage

A runnable [example playground](./example/playground/README.md) application for live editing is available:

```bash
yarn dev
```

In your own app, import and add the ranked renderer configurations and supply them to the JSON Forms component. i.e.:

```typescript vuejs
<script lang="ts">
import { JsonForms } from "@jsonforms/vue";
import primeVueRenderers from "@unchartedsoftware/jsonforms-primevue";
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';

// Important: Register the PrimeVue tooltip directive for description tooltips to work
app.use(PrimeVue);
app.directive('tooltip', Tooltip);

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

For detailed documentation on all available components, options, and customization features, please refer to the [Documentation](./DOCS.md).

## Roadmap / TODO

 - [ ] Basic controls for all types
   - [x] String input 
   - [x] Number & Integer Input
     - [x] Min/Max range support 
     - [x] Step support
     - [x] Prefix/Suffix support
     - [ ] As-slider support
   - [ ] Enum
     - [x] as strings 
     - [x] as dropdown
     - [ ] as oneOf (to support value vs label for each item)
     - [ ] as 'radio' option
   - [x] Boolean (checkbox)
   - [ ] Date
   - [x] Date-Time
   - [x] Label placement options (float | left | right)
   - [x] Description display & options (onfocus | always | tooltip)
   - [ ] Support default values
   - [ ] Radio options
 - [x] Group Layout renderer (with toggleable option to render as an accordion)
 - [x] HorizontalLayout / VerticalLayout styling
   - [ ] Wrap/no-wrap or grid type support
 - [ ] Error / invalid state feedback
 - [ ] Rules
   - [ ] Disable 
   - [ ] Visibility
 - [x] Image display (option on Label)
