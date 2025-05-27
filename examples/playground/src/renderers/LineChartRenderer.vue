<template>
  <ControlWrapper
    v-bind="controlWrapper"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <div v-if="appliedOptions.displayOnly" class="p-3 text-900">
      <div class="text-sm text-500 mb-2">Line Chart Data ({{ dataPoints.length }} points)</div>
      <div class="text-xs text-400" v-if="timeRange.start !== 'N/A'">
        {{ timeRange.start }} to {{ timeRange.end }}
      </div>
    </div>
    <div v-else>
      <div ref="vegaContainer" class="w-full" style="min-height: 300px;"></div>
      <div v-if="error" class="text-red-500 text-sm mt-2">
        Error rendering chart: {{ error }}
      </div>
    </div>
  </ControlWrapper>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick } from 'vue';
import { type ControlElement } from '@jsonforms/core';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { ControlWrapper, useControlCommon } from '@unchartedsoftware/jsonforms-primevue';
import * as vegaEmbed from 'vega-embed';
import type { TopLevelSpec } from 'vega-lite';

const props = defineProps(rendererProps<ControlElement>());
const controlProps = useJsonFormsControl(props);
const controlCommon = useControlCommon(controlProps);

// Debug log to confirm the renderer is being used
console.log('LineChartRenderer mounted with data:', controlProps.control.value.data);

const {
  appliedOptions,
  control,
  controlWrapper,
  isFocused
} = controlCommon;

const vegaContainer = ref<HTMLElement>();
const error = ref<string>('');

// Extract encoding from options
const encoding = computed(() => appliedOptions.value.encoding || {});

// Extract chart configuration from options
const chartOptions = computed(() => ({
  title: appliedOptions.value.title || 'Line Chart',
  width: appliedOptions.value.width || 600,
  height: appliedOptions.value.height || 300,
  lineColor: appliedOptions.value.lineColor || '#1f77b4',
  errorBarColor: appliedOptions.value.errorBarColor || '#aec7e8',
  errorBandColor: appliedOptions.value.errorBandColor || '#e6f3ff',
  errorBandOpacity: appliedOptions.value.errorBandOpacity || 0.3,
  showAsErrorBand: appliedOptions.value.showAsErrorBand || false
}));

// Process the data points
const dataPoints = computed(() => {
  if (!control.value.data || !Array.isArray(control.value.data)) {
    return [];
  }
  return control.value.data;
});

// Calculate time range for display (if x field is temporal)
const timeRange = computed(() => {
  if (dataPoints.value.length === 0 || !encoding.value.x?.field) {
    return { start: 'N/A', end: 'N/A' };
  }
  
  const xField = encoding.value.x.field;
  const isTemporalX = encoding.value.x.type === 'temporal';
  
  if (!isTemporalX) {
    return { start: 'N/A', end: 'N/A' };
  }
  
  const times = dataPoints.value
    .map(point => point[xField])
    .filter(time => time != null)
    .sort();
  
  return {
    start: times[0] || 'N/A',
    end: times[times.length - 1] || 'N/A'
  };
});

// Create Vega-Lite specification
const createVegaSpec = (): TopLevelSpec => {
  const opts = chartOptions.value;
  const enc = encoding.value;
  
  if (!enc.x || !enc.y) {
    throw new Error('Both x and y encodings are required for line chart');
  }
  
  // Base line chart layer
  const lineLayer: any = {
    mark: {
      type: 'line',
      point: true,
      color: opts.lineColor,
      strokeWidth: 2
    },
    encoding: {
      x: {
        field: enc.x.field,
        type: enc.x.type,
        title: enc.x.title || (enc.x.field.charAt(0).toUpperCase() + enc.x.field.slice(1))
      },
      y: {
        field: enc.y.field,
        type: enc.y.type,
        title: enc.y.title || (enc.y.field.charAt(0).toUpperCase() + enc.y.field.slice(1))
      },
      tooltip: [
        { field: enc.x.field, type: enc.x.type },
        { field: enc.y.field, type: enc.y.type }
      ]
    }
  };

  // Add color encoding if specified
  if (enc.color) {
    lineLayer.encoding.color = {
      field: enc.color.field,
      type: enc.color.type,
      title: enc.color.title || enc.color.field
    };
    lineLayer.encoding.tooltip.push({
      field: enc.color.field,
      type: enc.color.type
    });
  }

  const layers: any[] = [lineLayer];

  // Add error visualization if error encodings exist
  if (enc.yError || enc.yError2) {
    const hasErrorData = dataPoints.value.some(point => {
      if (enc.yError && point[enc.yError.field] != null) return true;
      if (enc.yError2 && point[enc.yError2.field] != null) return true;
      return false;
    });

    if (hasErrorData) {
      if (opts.showAsErrorBand && enc.yError && enc.yError2) {
        // Error band layer (area chart) - requires both yError and yError2
        const errorBandLayer = {
          mark: {
            type: 'area',
            color: opts.errorBandColor,
            opacity: opts.errorBandOpacity,
            line: false,
            interpolate: 'linear'
          },
          encoding: {
            x: {
              field: enc.x.field,
              type: enc.x.type
            },
            y: {
              field: enc.yError.field,
              type: enc.yError.type
            },
            y2: {
              field: enc.yError2.field,
              type: enc.yError2.type
            },
            tooltip: [
              { field: enc.x.field, type: enc.x.type },
              { field: enc.yError.field, type: enc.yError.type, title: 'Lower Bound' },
              { field: enc.yError2.field, type: enc.yError2.type, title: 'Upper Bound' }
            ]
          }
        };

        // Insert error band before the line layer so it appears behind
        layers.unshift(errorBandLayer);
      } else {
        // Error bar layer using Vega-Lite's built-in error bar support
        if (enc.yError && enc.yError2) {
          // Asymmetric error bars
          const errorBarLayer = {
            mark: {
              type: 'rule',
              color: opts.errorBarColor,
              strokeWidth: 1
            },
            encoding: {
              x: {
                field: enc.x.field,
                type: enc.x.type
              },
              y: {
                field: enc.yError.field,
                type: enc.yError.type
              },
              y2: {
                field: enc.yError2.field,
                type: enc.yError2.type
              },
              tooltip: [
                { field: enc.x.field, type: enc.x.type },
                { field: enc.yError.field, type: enc.yError.type, title: 'Lower Bound' },
                { field: enc.yError2.field, type: enc.yError2.type, title: 'Upper Bound' }
              ]
            }
          };
          layers.push(errorBarLayer);
        } else if (enc.yError) {
          // Symmetric error bars (yError represents the error magnitude)
          const errorBarLayer = {
            mark: {
              type: 'errorbar',
              color: opts.errorBarColor
            },
            encoding: {
              x: {
                field: enc.x.field,
                type: enc.x.type
              },
              y: {
                field: enc.y.field,
                type: enc.y.type
              },
              yError: {
                field: enc.yError.field,
                type: enc.yError.type
              }
            }
          };
          layers.push(errorBarLayer);
        }
      }

      // Add error fields to main line tooltip
      if (enc.yError) {
        lineLayer.encoding.tooltip.push({
          field: enc.yError.field,
          type: enc.yError.type,
          title: enc.yError.title || 'Error'
        });
      }
      if (enc.yError2) {
        lineLayer.encoding.tooltip.push({
          field: enc.yError2.field,
          type: enc.yError2.type,
          title: enc.yError2.title || 'Error Upper'
        });
      }
    }
  }

  return {
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    title: opts.title,
    width: opts.width,
    height: opts.height,
    data: {
      values: dataPoints.value
    },
    layer: layers
  };
};

// Render the chart
const renderChart = async () => {
  if (!vegaContainer.value || dataPoints.value.length === 0) {
    return;
  }

  try {
    error.value = '';
    const spec = createVegaSpec();
    
    await vegaEmbed.default(vegaContainer.value, spec, {
      actions: {
        export: true,
        source: false,
        compiled: false,
        editor: false
      }
    });
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('Error rendering Vega-Lite chart:', err);
  }
};

// Watch for data changes and re-render
watch([dataPoints, encoding, chartOptions], () => {
  nextTick(() => {
    renderChart();
  });
}, { deep: true });

// Initial render
onMounted(() => {
  nextTick(() => {
    renderChart();
  });
});
</script> 