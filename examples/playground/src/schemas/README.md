# Schema Documentation

This directory contains the JSON Schema definitions for the playground application.

## Schema Files

### `dataSchema.json`
The main schema file that defines the structure for form inputs and UI controls. This includes:
- Testing controls (strings, numbers, booleans, enums, etc.)
- Display-only test controls
- Complex object examples (UFO sighting reports)
- References to analytics output schemas

### `outputDataSchema.json`
A standard JSON Schema file for analytics output data structures. This contains **pure data definitions** without any visualization-specific information:
- Temperature readings arrays
- Graph edge count analysis
- Performance metrics
- Summary statistics
- System alerts

### `outputUiSchema.json`
A JSON Forms UI Schema that defines how analytics outputs should be rendered, following the exact same pattern as regular JSON Forms but for output visualization:
- Uses standard JSON Forms layout elements (VerticalLayout, Group, Control)
- Controls reference data via `scope` (e.g., `#/properties/temperatureReadings`)
- Visualization encoding specified in `options.encoding`
- Controls without encoding get default rendering (tables, cards, etc.)

### `uiSchema.json`
Defines the UI layout and rendering instructions for input forms using JSON Forms.

### `exampleData.json`
Contains sample data that matches the schema definitions.

## Architecture: Perfect JSON Forms Parallel

| JSON Forms (Input) | Analytics Output System |
|-------------------|-------------------------|
| `dataSchema.json` | `outputDataSchema.json` |
| `uiSchema.json` | `outputUiSchema.json` |
| Control renders form field | Control renders chart/visualization |
| `options` for field config | `options.encoding` for chart config |
| `scope` points to input data | `scope` points to output data |

## Design Principles

### JSON Forms Consistency
The output system mirrors JSON Forms architecture exactly:
- **Data Schema**: Pure JSON Schema for data structure validation
- **UI Schema**: Layout and rendering instructions with encoding options
- **Separation of Concerns**: Data structure separate from presentation
- **Familiar Patterns**: Developers already know this structure

### Encoding System
Analytics authors can provide Vega-Lite style encoding hints:
```json
{
  "type": "Control",
  "scope": "#/properties/temperatureReadings",
  "options": {
    "encoding": {
      "x": {"field": "timestamp", "type": "temporal"},
      "y": {"field": "value", "type": "quantitative"},
      "color": {"field": "sensor", "type": "nominal"}
    }
  }
}
```

### Rendering Control
- **You control**: Chart types, colors, styling, layout
- **Analytics control**: Which fields to encode and their semantic types
- **Default behavior**: Controls without encoding get sensible defaults

## Usage Examples

### Standard JSON Schema Output
```json
{
  "temperatureReadings": {
    "type": "array",
    "items": {
      "type": "object",
      "properties": {
        "timestamp": {"type": "string", "format": "date-time"},
        "value": {"type": "number"},
        "sensor": {"type": "string"}
      }
    }
  }
}
```

### Corresponding UI Schema with Encoding
```json
{
  "type": "Control",
  "scope": "#/properties/temperatureReadings",
  "options": {
    "encoding": {
      "x": {"field": "timestamp", "type": "temporal"},
      "y": {"field": "value", "type": "quantitative"},
      "color": {"field": "sensor", "type": "nominal"}
    }
  }
}
```

### Default Rendering (No Encoding)
```json
{
  "type": "Control",
  "scope": "#/properties/summary"
  // Renders as table, cards, or other default format
}
```

## Benefits

1. **Familiar**: Developers already understand JSON Forms patterns
2. **Flexible**: Can use all JSON Forms layout capabilities
3. **Clean**: Pure data schemas, separate presentation concerns
4. **Extensible**: Easy to add new encoding options or layout types
5. **Optional**: Analytics can provide encoding or rely on defaults
6. **Controlled**: You decide final visual representation 