# jsonforms-primevue

## Motivation

The JSONForms.io packages include integrations for vanilla HTML and Veutify, but we needed PrimeVue.
In addition, we needed to support other new options such as:
 - Display-only mode: Rather than just 'disabling' the control, we want to display the control as a read-only text display
   - Allows JSONForms to be used not only to describe Input forms, but also to describe Output displays
 - Label controls as captioned images
 - Description display (always, tooltip)
 - Layout options (default, space-between)
 - Number control options (step, prefix, suffix)
 - Date/Time control options (hourFormat)

## Installation

```bash
yarn add @uncharted.software/jsonforms-primevue @jsonforms/core @jsonforms/vue primevue primeflex
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
import primeVueRenderers from "@uncharted.software/jsonforms-primevue";
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
   - [x] Description display & options (always | tooltip)
   - [ ] Support default values
   - [ ] Radio options
 - [x] Group Layout renderer (with toggleable option to render as an accordion)
 - [x] HorizontalLayout / VerticalLayout styling
   - [ ] Wrap/no-wrap or grid type support
 - [x] Tables
 - [ ] Error / invalid state feedback
 - [x] Rules
   - [x] Disable 
   - [x] Visibility
 - [x] Image display (option on Label)
