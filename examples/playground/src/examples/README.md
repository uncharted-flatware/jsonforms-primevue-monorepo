# Playground examples

Each demo lives in its own directory under `src/examples/<slug>/`. The playground discovers folders automatically at build time (no manual registry).

## File contract

| File | Purpose |
|------|---------|
| `meta.json` | `{ "label": "Display name", "order": 1 }` — dropdown label and sort order |
| `dataSchema.json` | JSON Schema root for this demo |
| `uiSchema.json` | UI layout for this demo only |
| `data.json` | Instance data matching the schema |

Add a new example by creating a new folder with all four files.

## Regenerating from a monolith (optional)

If you restore combined schema files under `src/schemas/` (`dataSchema.json`, `uiSchema.json`, `exampleData.json`), run:

```bash
node scripts/split-monolith-examples.mjs
```

That writes split output to `src/examples/`. Review the script summary, then remove or replace old example folders as needed.

## Middleware demo

The **Middleware: displayOnly on INIT** example uses `middlewareDisplayOnlyDemo` in its schema. Playground middleware in `src/middleware/displayOnlyOnInitMiddleware.ts` applies `displayOnly` on INIT for that scope only when that example is selected.
