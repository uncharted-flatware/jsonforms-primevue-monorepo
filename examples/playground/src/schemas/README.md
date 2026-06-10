# Schema Documentation

This directory contains the JSON Schema definitions for the playground application.

## Schema Files

### `dataSchema.json`
The main schema file that defines the structure for form inputs and UI controls. This includes:
- Testing controls (strings, numbers, booleans, enums, etc.)
- Display-only test controls
- Complex object examples (UFO sighting reports)

### `uiSchema.json`
Defines the UI layout and rendering instructions for input forms using JSON Forms.

The **UI Schema Rules (SHOW / HIDE / ENABLE / DISABLE)** group demonstrates conditional visibility and enabled state via `rule` on controls (see [JSON Forms rules](https://jsonforms.io/docs/uischema/rules)).

### `exampleData.json`
Contains sample data that matches the schema definitions. 