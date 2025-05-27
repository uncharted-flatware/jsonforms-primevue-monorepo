import { rankWith, and, schemaSubPathMatches, resolveSchema, isObjectArrayControl } from '@jsonforms/core';
import TimeseriesRenderer from './TimeseriesRenderer.vue';

// Tester for timeseries data (array of dataPoint2d objects)
const timeseriesTester = rankWith(
  4, // Higher rank than default renderers
  and(
    isObjectArrayControl,
    schemaSubPathMatches('items', (schema) => {
      // Check if items references the dataPoint2d definition
      return schema.$ref === '#/definitions/dataPoint2d';
    })
  )
);

export const customRenderers = [
  { tester: timeseriesTester, renderer: TimeseriesRenderer }
]; 