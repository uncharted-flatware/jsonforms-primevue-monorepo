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
  - [Line Chart Control](#line-chart-control)
- [Layout Components](#layout-components)
  - [Group Layout](#group-layout)
  - [Horizontal Layout](#horizontal-layout)
  - [Vertical Layout](#vertical-layout)
  - [Label](#label)
- [Common Options](#common-options)
  - [Label Placement](#label-placement)
  - [Description Display](#description-display)
- [Styling](#styling)
  - [Hook classes reference](#hook-classes-reference)
  - [Field sizing in the host app](#field-sizing-in-the-host-app)
- [Advanced Features](#advanced-features)

## Basic Usage

To use JSONForms PrimeVue in your application, you need to import the renderer set and register it with the JSONForms component:

```typescript
import { JsonForms } from "@jsonforms/vue";
import primeVueRenderers from "@uncharted.software/jsonforms-primevue";
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
- `multi`: Set to `true` to render a multi-line textarea instead of a single-line input
- `rows`: Number of visible text rows when `multi` is `true` (default: `3`)

**Multi-line UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/description",
  "options": {
    "multi": true,
    "rows": 5,
    "placeholder": "Enter description"
  }
}
```

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
    "emptyMessage": "No tags added yet",
    "detail": "GENERATED"
  }
}
```

**Options:**
- All common options (focus, descriptionDisplay, labelPlacement, displayOnly)
- `emptyMessage`: Custom message to display when the array is empty (defaults to "No items found")
- `elementLabelProp`: Property to use as the label for each array item
- `showSortButtons`: Enable buttons to reorder array items
- `detail`: Controls how array items are rendered. Can be one of:
  - `"DEFAULT"`: Renders a simple control without any special detail view
  - `"GENERATED"`: Automatically generates a UI schema based on the item's schema properties
  - `"REGISTERED"`: Uses a registered UI schema for the item's type, falling back to generated if none found
  - `{ type: "Layout", elements: [...] }`: Uses the provided UI schema directly to render each item

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
- For more details on the `detail` option, see the [JSONForms documentation](https://jsonforms.io/docs/uischema/controls#the-detail-option)

### Line Chart Control

The Line Chart Control renders interactive line charts with support for error bars and multiple data series using Vega-Lite visualization.

**Schema Example:**
```json
{
  "type": "object",
  "properties": {
    "temperatureData": {
      "type": "array",
      "title": "Temperature Measurements",
      "items": {
        "type": "object",
        "properties": {
          "timestamp": {
            "type": "string",
            "format": "date-time",
            "title": "Measurement Time"
          },
          "value": {
            "type": "number",
            "title": "Temperature"
          },
          "errorLow": {
            "type": "number",
            "title": "Lower Error Bound"
          },
          "errorHigh": {
            "type": "number",
            "title": "Upper Error Bound"
          },
          "sensor": {
            "type": "string",
            "title": "Sensor ID"
          }
        },
        "required": ["timestamp", "value"]
      }
    }
  }
}
```

**UI Schema Example:**
```json
{
  "type": "Control",
  "scope": "#/properties/temperatureData",
  "options": {
    "title": "Temperature Over Time",
    "encoding": {
      "x": {"field": "timestamp", "type": "temporal"},
      "y": {"field": "value", "type": "quantitative"},
      "yError": {"field": "errorLow", "type": "quantitative"},
      "yError2": {"field": "errorHigh", "type": "quantitative"},
      "color": {"field": "sensor", "type": "nominal"}
    },
    "width": 600,
    "height": 400,
    "showAsErrorBand": true,
    "lineColor": "#2563eb",
    "errorBandColor": "#dbeafe",
    "errorBandOpacity": 0.4
  }
}
```

**Encoding Options:**
The `encoding` option defines how data fields map to visual properties:

- **Required encodings:**
  - `x`: Horizontal axis mapping (field, type, optional title)
  - `y`: Vertical axis mapping (field, type, optional title)

- **Optional encodings:**
  - `color`: Color encoding for grouping data series
  - `size`: Size encoding for point sizes
  - `yError`: Lower error bound or symmetric error magnitude
  - `yError2`: Upper error bound for asymmetric error bars
  - `xError`: Horizontal error bars (lower bound)
  - `xError2`: Horizontal error bars (upper bound)

- **Field types:**
  - `temporal`: Date/time data
  - `quantitative`: Numeric data
  - `nominal`: Categorical data (unordered)
  - `ordinal`: Categorical data (ordered)

**Chart Styling Options:**
- `title`: Chart title
- `width`: Chart width in pixels (default: 600)
- `height`: Chart height in pixels (default: 300)
- `lineColor`: Color of the main line (default: "#1f77b4")
- `errorBarColor`: Color of error bars (default: "#aec7e8")
- `errorBandColor`: Color of error bands (default: "#e6f3ff")
- `errorBandOpacity`: Opacity of error bands (default: 0.3)
- `showAsErrorBand`: Show errors as filled bands instead of bars (default: false)

**Error Visualization:**
- **Symmetric errors**: Use only `yError` encoding
- **Asymmetric errors**: Use both `yError` and `yError2` encodings
- **Error bands**: Set `showAsErrorBand: true` for filled confidence intervals
- **Error bars**: Set `showAsErrorBand: false` for traditional error bars

**Features:**
- Interactive Vega-Lite charts with zoom, pan, and export capabilities
- Support for multiple data series with automatic color coding
- Error bars and confidence intervals
- Responsive design that adapts to container size
- Automatic tooltip generation showing all encoded fields
- Display-only mode for read-only chart viewing

**Notes:**
- Requires both `x` and `y` encodings to be specified
- The control automatically activates when an array has an `encoding` option
- Uses Vega-Lite v6 for chart rendering
- Error encodings are optional and will only render if the corresponding data fields exist

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
- `isExpanded`: Controls the initial expansion state. Groups are expanded by default unless explicitly set to `false`

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
  ],
  "options": {
    "isWrappingEnabled": true
  }
}
```

**Options:**
- `isWrappingEnabled`: When `true`, allows elements to wrap to the next line if they don't fit in the available space. When `false` (default), elements will stay on a single line and may overflow their container.
- `layout`: Controls the spacing between elements. Can be `'default'` (standard gaps) or `'space-between'` (maximum space distributed between elements). Only applicable when `isWrappingEnabled` is `false`.

**Space-Between Layout Example:**

```json
{
  "type": "HorizontalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/firstName",
      "options": {
        "placeholder": "Left side"
      }
    },
    {
      "type": "Control", 
      "scope": "#/properties/lastName",
      "options": {
        "placeholder": "Right side"
      }
    }
  ],
  "options": {
    "layout": "space-between"
  }
}
```

**Notes:**
- Space-between layout fills the full width and places elements at opposite ends
- Not compatible with `isWrappingEnabled: true`
- Useful for creating split layouts like left/right form sections

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

### Label

The Label element displays static text in the form. It does not bind to schema data. Use it for section headings, instructions, or decorative content.

**UI Schema Example (text only):**

```json
{
  "type": "Label",
  "text": "Personal details"
}
```

**UI Schema Example (text with image):**

When `options.imageUrl` is set, the label renders as a centered image inside a card, with the label text shown below the image and used as the image `alt` text.

```json
{
  "type": "Label",
  "text": "UFO Sighting Report",
  "options": {
    "imageUrl": "saucer.png",
    "imageWidth": 200,
    "imageHeight": 200
  }
}
```

**Options:**

- `imageUrl`: URL of the image to display. When present, the label uses the image layout instead of plain text.
- `imageWidth`: Optional width in pixels (applied to the `<img>` element).
- `imageHeight`: Optional height in pixels (applied to the `<img>` element).

**Notes:**

- Image URLs are resolved like any static asset in your app (e.g. paths under `public/` in Vite). Use a relative path (e.g. `saucer.png`) or a full URL; a leading slash (`/saucer.png`) points at the site root and breaks when the app is hosted under a subpath (such as GitHub Pages project sites).
- Label visibility follows the same JSON Forms rules as other UI elements (including rule-based show/hide).

## Common Options

### Display Only Mode

All control renderers support a `displayOnly` mode that renders the field values as read-only text instead of interactive input controls. This is useful for creating read-only forms or displaying data in a non-editable format.

**Key Differences:**
- `displayOnly`: Completely replaces the input control with a text display, removing all interactive elements
- `readonly`: Keeps the input control visible but prevents user interaction
- `disabled`: Keeps the input control visible but grays it out and prevents interaction

**Configuration:**

In your UI schema, you can enable display-only mode using the `displayOnly` option:

```json
{
  "type": "Control",
  "scope": "#/properties/myField",
  "options": {
    "displayOnly": true,
    "compact": true  // Optional: reduces padding and spacing in display-only mode
  }
}
```

**Options:**
- `displayOnly`: Set to `true` to render the field as read-only text display
- `compact`: Set to `true` to reduce padding and spacing in display-only mode (default: `false`)

**Behavior by Control Type:**

- **String Control**: Displays the text value with any configured prefix/suffix
- **Number/Integer Control**: Displays the formatted number with prefix/suffix
- **Boolean Control**: Shows a checkmark (✓) or X (✗) icon
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
- `top`: Label appears above the input field in a vertical layout
- `hide`: No label is displayed (useful for compact layouts or when context is clear from placement)

### Layout Options

You can control how the label and input field are positioned within the container using the `layout` option:

```json
{
  "type": "Control",
  "scope": "#/properties/name",
  "options": {
    "labelPlacement": "left",
    "layout": "space-between"
  }
}
```

**Available values:**
- `default`: Standard layout with gaps between elements
- `space-between`: Container fills full width with maximum space distributed between label and input field

**Space-Between Layout:**

The `space-between` layout is particularly useful for creating forms where you want:
- Labels and fields at opposite ends of the container
- Consistent alignment across fields with varying label lengths  
- Maximum utilization of available horizontal space
- Professional settings panels or configuration forms

**Example:**

```json
// Data Schema
{
  "properties": {
    "shortLabel": {
      "type": "string",
      "title": "Name",
      "description": "Short label with space-between layout"
    },
    "longLabel": {
      "type": "string", 
      "title": "Very Long Configuration Setting Name",
      "description": "Long label with space-between layout"
    }
  }
}

// UI Schema with space-between layout
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "scope": "#/properties/shortLabel",
      "options": {
        "labelPlacement": "left",
        "layout": "space-between",
        "placeholder": "Field positioned at right edge"
      }
    },
    {
      "type": "Control",
      "scope": "#/properties/longLabel", 
      "options": {
        "labelPlacement": "left",
        "layout": "space-between",
        "placeholder": "Also at right edge despite long label"
      }
    }
  ]
}
```

**Notes:**
- Works with both `labelPlacement: 'left'` and `labelPlacement: 'right'`
- Automatically handles varying label lengths while maintaining consistent field positioning
- Not applicable with `labelPlacement: 'float'`, `'top'`, or `'hide'`

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

## Icons

Built-in renderers use a small set of semantic icons (array actions, description tooltip, boolean display-only, and similar). The package ships **inline SVG defaults** and does **not** require [PrimeIcons](https://www.npmjs.com/package/primeicons) or `@primevue/icons`.

Override any icon by calling `provideJsonFormsPrimeVueIcons` in your app setup (for example with [Phosphor](https://phosphoricons.com/)):

```typescript
import {
  PhCaretDown,
  PhCaretUp,
  PhCheck,
  PhCircle,
  PhInfo,
  PhPlus,
  PhTrash,
  PhX,
} from '@phosphor-icons/vue';
import { provideJsonFormsPrimeVueIcons } from '@uncharted.software/jsonforms-primevue';

provideJsonFormsPrimeVueIcons({
  info: PhInfo,
  plus: PhPlus,
  chevronUp: PhCaretUp,
  chevronDown: PhCaretDown,
  trash: PhTrash,
  check: PhCheck,
  close: PhX,
  circleFill: PhCircle,
});
```

| Key | Used for |
|-----|----------|
| `info` | Description tooltip next to the label |
| `plus` | Add array item / row |
| `chevronUp`, `chevronDown` | Reorder array items |
| `trash` | Remove array item |
| `check`, `close` | Boolean display-only true / false |
| `circleFill` | Primitive array list marker |

Custom renderers can use the same registry via `useJsonFormsPrimeVueIcons()` or the exported `JsonFormsIcon` component.

**PrimeVue widgets:** controls such as `DatePicker` with `showIcon` still use PrimeVue’s own icon configuration. Configure those in your PrimeVue theme or pass-through options separately from this registry.

## Styling

JSONForms PrimeVue does not ship a PrimeVue theme and does not require PrimeFlex. Form controls use your application's PrimeVue preset (Aura, Lara, etc.). The optional stylesheet only provides structural layout hooks:

```typescript
import '@uncharted.software/jsonforms-primevue/style.css';
```

Rules are declared in the `@layer jsonforms` layer so you can override them without fighting component specificity.

All hooks below are defined in [`src/jsonforms-layout.css`](src/jsonforms-layout.css) and applied from the built-in renderers. Override them from your app (typically in a higher-priority `@layer` or without a layer). PrimeVue widget classes (for example `.p-inputnumber`) are **not** part of this package but are stable targets inside `.jsonforms-control`.

### Hook classes reference

#### Layout

| Class | Where used | Purpose |
|-------|------------|---------|
| `jsonforms-layout` | Group (panel/accordion), horizontal layout root, vertical layout root | Marks a layout region; adds bottom spacing between major sections |

#### Vertical stacks (`flex` column + gap)

| Class | Where used | Purpose |
|-------|------------|---------|
| `jsonforms-stack` | Enum radio group, array item body | Default vertical gap between children |
| `jsonforms-stack--compact` | Compact arrays, multiline display-only strings | Tighter vertical gap |
| `jsonforms-stack--loose` | Vertical layout, group innards, array edit mode | Looser vertical gap |

#### Horizontal rows (`flex` row + gap)

| Class | Where used | Purpose |
|-------|------------|---------|
| `jsonforms-row` | Boolean display-only | Default horizontal row (nowrap, centered) |
| `jsonforms-row--wrap` | Horizontal layout when `isWrappingEnabled` | Allow wrapped horizontal items |
| `jsonforms-row--between` | Horizontal layout when `layout: 'space-between'` | `justify-content: space-between` |
| `jsonforms-row--actions` | *(stylesheet only)* | Tighter gap for button groups; combine with `jsonforms-row` if needed |
| `jsonforms-row--end` | Array add button (non-table) | Align row content to the end |
| `jsonforms-row--start` | Array “Add row” under table | Align row content to the start |

#### Control wrapper (`ControlWrapper`)

| Class | When applied | Purpose |
|-------|----------------|---------|
| `jsonforms-control` | Every control | Full-width block; bottom margin between fields |
| `jsonforms-control--label-top` | `labelPlacement: 'top'` | Label above control |
| `jsonforms-control--label-inline` | Default left/right label | Label and widget on one row |
| `jsonforms-control--layout-between` | `layout: 'space-between'` on control options | Label and widget at opposite ends |
| `jsonforms-control__widget` | Wrapper around each control’s PrimeVue field | Fills remaining width on inline / space-between rows when combined with PrimeVue `fluid` on inputs |
| `jsonforms-control__label` | Visible labels | Label text and optional info icon |
| `jsonforms-control__info` | Description tooltip icon | Info icon next to label |
| `jsonforms-control__description` | `descriptionDisplay: 'always'` | Always-visible description panel |

`labelPlacement: 'float'` and `'hide'` use `jsonforms-control` without an extra layout modifier (float uses PrimeVue `FloatLabel`; hide omits the label).

#### Display-only values

| Class | When applied | Purpose |
|-------|----------------|---------|
| `jsonforms-display-value` | `displayOnly` on string, number, integer, enum, date-time, duration | Base text color for read-only values |
| `jsonforms-display-value--padded` | `displayOnly` and not `compact` | Padding around read-only value |
| `jsonforms-display-value--compact-pad` | `displayOnly` compact string | Smaller padding (strings) |
| `jsonforms-display-boolean--true` | Boolean `displayOnly`, true | Icon color for “yes” |
| `jsonforms-display-boolean--false` | Boolean `displayOnly`, false | Icon color for “no” |

#### Array control

| Class | Where used | Purpose |
|-------|------------|---------|
| `jsonforms-array-empty` | No array items | Empty-state message |
| `jsonforms-array-actions` | Table action column, item headers, top add button | Horizontal group of array buttons |
| `jsonforms-array-item` | Editable object array entries | Wrapper on PrimeVue `Panel` per item |
| `jsonforms-array-item__header` | Panel header slot | Title + actions row |
| `jsonforms-array-item__title` | Item title in header | Item label text |
| `jsonforms-array-primitive-row` | Display-only primitive list items | Bullet row layout |
| `jsonforms-array-primitive-marker` | Bullet icon in primitive list | Small list marker styling |
| `jsonforms-array-primitive-content` | Primitive list cell | Grows to fill row beside marker |

#### Enum and label renderers

| Class | Where used | Purpose |
|-------|------------|---------|
| `jsonforms-radio-option` | Enum `format: 'radio'` | One radio + label row |
| `jsonforms-label-card` | Label with image | Centers image card content |
| `jsonforms-label-caption` | Caption under label image | Muted caption text |

The repository includes [`wrap-css.js`](wrap-css.js), an optional post-build script that prefixes selectors with `.jsonforms-container`. That class is **not** emitted by the default package build; use it only if you run the script and wrap `<JsonForms>` in an element with `class="jsonforms-container"`.

### Field sizing in the host app

Built-in renderers place each field inside `jsonforms-control__widget` and pass PrimeVue `fluid` on text, number, select, and date controls so widgets fill that wrapper on label-inline rows. The package does **not** set fixed pixel widths.

Optional host overrides (unlayered CSS, or a layer ordered after PrimeVue when `cssLayer: true`):

```css
.jsonforms-control__widget .p-inputnumber,
.jsonforms-control__widget .p-inputtext {
  min-width: 12rem;
  max-width: 24rem;
}
```

Customize further via these hooks, PrimeVue design tokens, or per-control pass-through (`pt`) in your own renderer extensions.

## Advanced Features

### Custom Renderers

You can create and register custom renderers to extend the functionality of JSONForms PrimeVue. Refer to the [JSONForms documentation](https://jsonforms.io/docs/custom-renderers) for more information on creating custom renderers.

### Validation

JSONForms PrimeVue supports validation based on the JSON Schema. Error messages will be displayed when validation fails.

### Conditional Rendering

You can use the `rule` property in the UI schema to conditionally show or hide elements based on the current form data. Refer to the [JSONForms documentation for rules](https://jsonforms.io/docs/uischema/rules) for more information.