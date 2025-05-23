# JSONForms PrimeVue Documentation

This documentation provides detailed information about the JSONForms PrimeVue renderer set, including available components, configuration options, and customization features.

## Table of Contents

- [Basic Usage](#basic-usage)
- [Control Components](#control-components)
  - [String Control](#string-control)
  - [Number Control](#number-control)
  - [Integer Control](#integer-control)
  - [Boolean Control](#boolean-control)
  - [Enum Control](#enum-control)
  - [Date-Time Control](#date-time-control)
  - [Duration Control](#duration-control)
  - [Array Control](#array-control)
- [Layout Components](#layout-components)
  - [Group Layout](#group-layout)
  - [Horizontal Layout](#horizontal-layout)
  - [Vertical Layout](#vertical-layout)
- [Common Options](#common-options)
  - [Label Placement](#label-placement)
  - [Description Display](#description-display)
- [Advanced Features](#advanced-features)

## Basic Usage

To use JSONForms PrimeVue in your application, you need to import the renderer set and register it with the JSONForms component:

```typescript
import { JsonForms } from "@jsonforms/vue";
import primeVueRenderers from "@unchartedsoftware/jsonforms-primevue";
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';

// Register PrimeVue and the tooltip directive
app.use(PrimeVue);
app.directive('tooltip', Tooltip);

// In your component
export default defineComponent({
  name: 'MyForm',
  setup() {
    const data = ref({});
    const schema = ref({
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Your full name' }
      }
    });
    const uischema = ref({
      type: 'VerticalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name'
        }
      ]
    });

    const handleChange = (event) => {
      data.value = event.data;
    };

    return { data, schema, uischema, primeVueRenderers, handleChange };
  }
});
```

```html
<template>
  <JsonForms
    :data="data"
    :schema="schema"
    :uischema="uischema"
    :renderers="primeVueRenderers"
    @change="handleChange"
  />
</template>
```

## Control Components

### String Control

The String Control renders a text input field for string values.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "description": "Your first name"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/firstName",
  "options": {
    "placeholder": "Enter your first name",
    "focus": true,
    "descriptionDisplay": "tooltip"
  }
}
```

**Options:**
- `placeholder`: Text to display when the field is empty
- `focus`: Set to `true` to auto-focus this field when the form loads
- `descriptionDisplay`: How to display the description (see [Description Display](#description-display))
- `labelPlacement`: Where to place the label (see [Label Placement](#label-placement))
- `displayOnly`: Set to `true` to render the field as read-only text display

### Number Control

The Number Control renders a numeric input field for decimal numbers.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "price": {
      "type": "number",
      "minimum": 0,
      "maximum": 1000,
      "multipleOf": 0.01,
      "description": "Product price"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/price",
  "options": {
    "placeholder": "Enter price",
    "step": 0.1,
    "prefix": "$",
    "suffix": "USD"
  }
}
```

**Options:**
- All common options (placeholder, focus, descriptionDisplay, labelPlacement, displayOnly)
- `step`: The step increment for the number input (defaults to 0.1 if not specified)
- `prefix`: Text to display before the number (e.g., currency symbol)
- `suffix`: Text to display after the number (e.g., unit)

**Schema Constraints:**
- `minimum`: The minimum allowed value
- `maximum`: The maximum allowed value
- `multipleOf`: If specified, the value must be a multiple of this number

### Integer Control

The Integer Control renders a numeric input field for integer values, with increment/decrement buttons.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "quantity": {
      "type": "integer",
      "minimum": 1,
      "maximum": 100,
      "description": "Quantity to order"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/quantity",
  "options": {
    "placeholder": "Enter quantity",
    "step": 1,
    "prefix": "×",
    "suffix": "units"
  }
}
```

**Options:**
- All common options (placeholder, focus, descriptionDisplay, labelPlacement, displayOnly)
- `step`: The step increment for the number input (defaults to 1 if not specified)
- `prefix`: Text to display before the number
- `suffix`: Text to display after the number

**Schema Constraints:**
- `minimum`: The minimum allowed value
- `maximum`: The maximum allowed value
- `multipleOf`: If specified, the value must be a multiple of this number

### Boolean Control

The Boolean Control renders a checkbox for boolean values.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "subscribe": {
      "type": "boolean",
      "description": "Subscribe to our newsletter"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/subscribe",
  "options": {
    "focus": false
  }
}
```

**Options:**
- All common options (focus, descriptionDisplay, labelPlacement, displayOnly)

### Enum Control

The Enum Control renders a dropdown for selecting from a list of predefined values.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "color": {
      "type": "string",
      "enum": ["red", "green", "blue", "yellow"],
      "description": "Select a color"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/color",
  "options": {
    "placeholder": "Choose a color"
  }
}
```

**Options:**
- All common options (placeholder, focus, descriptionDisplay, labelPlacement, displayOnly)

### Date-Time Control

The Date-Time Control renders a date and time picker.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "meetingTime": {
      "type": "string",
      "format": "date-time",
      "description": "Schedule a meeting time"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/meetingTime",
  "options": {
    "placeholder": "Select date and time",
    "hourFormat": "24"
  }
}
```

**Options:**
- All common options (placeholder, focus, descriptionDisplay, labelPlacement, displayOnly)
- `hourFormat`: "12" (default) or "24" to specify the hour format

### Duration Control

The Duration Control renders a numeric input for ISO 8601 duration values, currently supporting days.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "vacationDays": {
      "type": "string",
      "format": "duration",
      "description": "Vacation duration in days"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/vacationDays",
  "options": {
    "placeholder": "Enter number of days"
  }
}
```

**Options:**
- All common options (placeholder, focus, descriptionDisplay, labelPlacement, displayOnly)

**Notes:**
- Currently only supports days in the format "P{n}D" (e.g., "P5D" for 5 days)

### Array Control

The Array Control renders a data table for managing arrays of values, with support for adding, removing, and editing items.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of tags"
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/tags",
  "options": {
    "emptyMessage": "No tags added yet"
  }
}
```

**Options:**
- All common options (focus, descriptionDisplay, labelPlacement, displayOnly)
- `emptyMessage`: Custom message to display when the array is empty (defaults to "No items found")

**Features:**
- Add new items with the "+" button
- Remove individual items with the trash icon
- Select multiple items to remove them in bulk
- Sort items by clicking column headers
- Filter items using the built-in search functionality
- Pagination support for large arrays
- Each item is rendered using the appropriate control based on its schema

**Notes:**
- The array control uses PrimeVue's DataTable component for a rich user experience
- Each item in the array is rendered using the appropriate control based on its schema
- The control maintains unique IDs for each item to ensure proper tracking and updates

## Layout Components

### Group Layout

The Group Layout groups related controls together, optionally with a header.

**UI Schema Example:**
```json
{
  "type": "Group",
  "label": "Personal Information",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/firstName"
    },
    {
      "type": "Control",
      "scope": "#/properties/lastName"
    }
  ],
  "options": {
    "asAccordion": true,
    "isExpanded": true
  }
}
```

**Options:**
- `asAccordion`: If `true`, renders as an accordion panel
- `isToggleable`: If `true`, allows the group to be collapsed/expanded (when not using accordion)
- `isExpanded`: If `true`, the group is expanded by default

### Horizontal Layout

The Horizontal Layout arranges elements horizontally.

**UI Schema Example:**
```json
{
  "type": "HorizontalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/firstName"
    },
    {
      "type": "Control",
      "scope": "#/properties/lastName"
    }
  ]
}
```

### Vertical Layout

The Vertical Layout arranges elements vertically.

**UI Schema Example:**
```json
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/email"
    },
    {
      "type": "Control",
      "scope": "#/properties/phone"
    }
  ]
}
```

## Common Options

### Display Only Mode

All control renderers support a `displayOnly` mode that renders the field values as read-only text instead of interactive input controls. This is useful for creating read-only forms or displaying data in a non-editable format.

**Configuration:**

In your UI schema, you can enable display-only mode using the `displayOnly` option:

```json
{
  "type": "Control",
  "scope": "#/properties/myField",
  "options": {
    "displayOnly": true
  }
}
```

**Behavior by Control Type:**

- **String Control**: Displays the text value with any configured prefix/suffix
- **Number/Integer Control**: Displays the formatted number with prefix/suffix
- **Boolean Control**: Shows a checkmark (✓) or X (✗) icon with "Yes"/"No" text
- **Enum Control**: Displays the selected value as text
- **Date-Time Control**: Shows the formatted date and time
- **Duration Control**: Displays the formatted duration (e.g., "5 days")
- **Array Control**: Hides add/remove buttons and renders all items in display-only mode
- **Object Control**: Renders all nested properties in display-only mode

**Example:**

```json
// Data Schema
{
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer" },
    "isActive": { "type": "boolean" }
  }
}

// UI Schema with display-only mode
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/name",
      "options": { "displayOnly": true }
    },
    {
      "type": "Control", 
      "scope": "#/properties/age",
      "options": { "displayOnly": true }
    },
    {
      "type": "Control",
      "scope": "#/properties/isActive", 
      "options": { "displayOnly": true }
    }
  ]
}
```

### Label Placement

You can control where the label appears relative to the input field using the `labelPlacement` option:

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "labelPlacement": "float"
  }
}
```

**Available values:**
- `left` (default): Label appears to the left of the input
- `right`: Label appears to the right of the input
- `float`: Label floats inside the input field (moves up when the field has a value)

### Description Display

JSONForms PrimeVue supports two different modes for displaying field descriptions:

**Configuration:**

In your UI schema, you can specify how descriptions should be displayed using the `descriptionDisplay` option:

```json
{
  "type": "Control",
  "scope": "#/properties/myField",
  "options": {
    "descriptionDisplay": "tooltip" // or "always"
  }
}
```

**Display Modes:**

- **tooltip** (default): Shows an info icon next to the label. When hovering over the icon, a tooltip with the description is displayed.
- **always**: Always displays the description text below the control.

**Example:**

```json
// Data Schema
{
  "properties": {
    "name": {
      "type": "string",
      "description": "Enter your full name as it appears on your ID"
    }
  }
}

// UI Schema
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "descriptionDisplay": "always" 
  }
}
```

## Advanced Features

### Custom Renderers

You can create and register custom renderers to extend the functionality of JSONForms PrimeVue. Refer to the [JSONForms documentation](https://jsonforms.io/docs/custom-renderers) for more information on creating custom renderers.

### Validation

JSONForms PrimeVue supports validation based on the JSON Schema. Error messages will be displayed when validation fails.

### Conditional Rendering

You can use the `rule` property in the UI schema to conditionally show or hide elements based on the current form data. Refer to the [JSONForms documentation for rules](https://jsonforms.io/docs/uischema/rules) for more information.