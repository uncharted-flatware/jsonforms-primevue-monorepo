# Array Table Display Feature

The ArrayControlRenderer now supports displaying arrays of objects as tables using PrimeVue's DataTable component.

## How to Use

Add the `displayAsTable: true` option to your array control in the UI schema:

```json
{
  "type": "Control",
  "scope": "#/properties/yourArray",
  "options": {
    "displayAsTable": true,
    "elementLabelProp": "name",
    "emptyMessage": "No items added yet",
    "showSortButtons": true
  }
}
```

## Available Options

### Table-Specific Options
- `displayAsTable: boolean` - Enables table display mode (only works for object arrays, not primitive arrays)

### Existing Options That Work With Table Mode
- `displayOnly: boolean` - Makes the table read-only
- `elementLabelProp: string` - Not used in table mode (columns are based on schema properties)
- `emptyMessage: string` - Message shown when array is empty
- `showSortButtons: boolean` - Shows move up/down buttons in the Actions column

## Features

### Editable Mode (`displayOnly: false` or not set)
- Each cell contains a full JSONForms control rendered via DispatchRenderer:
  - **Complete validation support** - All JSONForms validation rules apply
  - **Custom renderers** - Any custom control renderers will be used
  - **Full control options** - All control options (placeholder, format, etc.) work
  - **Proper data binding** - Changes are immediately reflected in form data
- Actions column with:
  - Move Up/Down buttons (if `showSortButtons: true`)
  - Remove button for each row
- Add Row button below the table

### Cell Editing Interaction
- **Each cell is a full JSONForms control** - No special table editing mode needed
- **Immediate updates** - Changes are reflected in real-time
- **Full control functionality** - Validation, formatting, custom options all work
- **Consistent UX** - Same behavior as controls outside the table

### Display-Only Mode (`displayOnly: true`)
- Values are displayed as formatted text:
  - Booleans show as "Yes"/"No"
  - Arrays show as "[X items]"
  - Objects show as "[Object]"
- No editing capabilities
- No action buttons

### Automatic Column Generation
- Columns are automatically generated based on the object schema properties
- Column headers use the property title if available, otherwise the property name
- Minimum column width of 12rem for readability
- Table is resizable

## Example

```json
{
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Label",
      "text": "Tasks Table (Editable)"
    },
    {
      "type": "Control",
      "scope": "#/properties/tasks",
      "options": {
        "displayAsTable": true,
        "emptyMessage": "No tasks added yet",
        "showSortButtons": true
      }
    },
    {
      "type": "Label", 
      "text": "Tasks Table (Read-Only)"
    },
    {
      "type": "Control",
      "scope": "#/properties/tasks",
      "options": {
        "displayAsTable": true,
        "displayOnly": true,
        "emptyMessage": "No tasks to display"
      }
    }
  ]
}
```

## Limitations

- Only works with arrays of objects (not primitive arrays like `string[]` or `number[]`)
- Cell editing is limited to basic input types (text, number, checkbox)
- Complex nested objects or arrays within cells show as formatted summaries
- Custom cell renderers are not yet supported

## Future Enhancements

Potential improvements that could be added:
- Custom cell renderers for complex data types
- Column sorting and filtering
- Column reordering
- Export functionality
- Custom column widths and visibility controls
- Pagination for large datasets 