<template>
  <ControlWrapper
    v-bind="controlWrapper"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <div v-if="appliedOptions.displayOnly" class="p-3 text-900">
      <div class="text-sm text-500 mb-2">Timeseries Data ({{ dataPoints.length }} points)</div>
      <div class="text-xs text-400">
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
console.log('TimeseriesRenderer mounted with data:', controlProps.control.value.data);



const {
  appliedOptions,
  control,
  controlWrapper,
  isFocused
} = controlCommon;

const vegaContainer = ref<HTMLElement>();
const error = ref<string>('');

// Extract configuration from options
const options = computed(() => ({
  independentVariable: appliedOptions.value.independentVariable || 'time',
  dependentVariable: appliedOptions.value.dependentVariable || 'value',
  minVariable: appliedOptions.value.minVariable || 'min',
  maxVariable: appliedOptions.value.maxVariable || 'max',
  title: appliedOptions.value.title || 'Timeseries Chart',
  width: appliedOptions.value.width || 600,
  height: appliedOptions.value.height || 300,
  showErrorBars: appliedOptions.value.showErrorBars !== false,
  showAsErrorBand: appliedOptions.value.showAsErrorBand || false,
  lineColor: appliedOptions.value.lineColor || '#1f77b4',
  errorBarColor: appliedOptions.value.errorBarColor || '#aec7e8',
  errorBandColor: appliedOptions.value.errorBandColor || '#e6f3ff',
  errorBandOpacity: appliedOptions.value.errorBandOpacity || 0.3
}));

// Process the data points
const dataPoints = computed(() => {
  if (!control.value.data || !Array.isArray(control.value.data)) {
    return [];
  }
  return control.value.data;
});

// Calculate time range for display
const timeRange = computed(() => {
  if (dataPoints.value.length === 0) {
    return { start: 'N/A', end: 'N/A' };
  }
  
  const timeField = options.value.independentVariable;
  const times = dataPoints.value
    .map(point => point[timeField])
    .filter(time => time != null)
    .sort();
  
  return {
    start: times[0] || 'N/A',
    end: times[times.length - 1] || 'N/A'
  };
});

// Create Vega-Lite specification
const createVegaSpec = (): TopLevelSpec => {
  const opts = options.value;
  
  // Base line chart layer
  const lineLayer = {
    mark: {
      type: 'line',
      point: true,
      color: opts.lineColor,
      strokeWidth: 2
    },
    encoding: {
      x: {
        field: opts.independentVariable,
        type: 'temporal' as const,
        title: opts.independentVariable.charAt(0).toUpperCase() + opts.independentVariable.slice(1)
      },
      y: {
        field: opts.dependentVariable,
        type: 'quantitative' as const,
        title: opts.dependentVariable.charAt(0).toUpperCase() + opts.dependentVariable.slice(1)
      },
      tooltip: [
        { field: opts.independentVariable, type: 'temporal' as const },
        { field: opts.dependentVariable, type: 'quantitative' as const }
      ]
    }
  };

  const layers: any[] = [lineLayer];

  // Add error visualization if enabled and min/max fields exist
  if (opts.showErrorBars) {
    const hasMinMax = dataPoints.value.some(point => 
      point[opts.minVariable] != null || point[opts.maxVariable] != null
    );

    if (hasMinMax) {
      if (opts.showAsErrorBand) {
        // Error band layer (area chart)
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
              field: opts.independentVariable,
              type: 'temporal' as const
            },
            y: {
              field: opts.minVariable,
              type: 'quantitative' as const
            },
            y2: {
              field: opts.maxVariable,
              type: 'quantitative' as const
            },
            tooltip: [
              { field: opts.independentVariable, type: 'temporal' as const },
              { field: opts.minVariable, type: 'quantitative' as const, title: 'Min' },
              { field: opts.maxVariable, type: 'quantitative' as const, title: 'Max' }
            ]
          }
        };

        // Insert error band before the line layer so it appears behind
        layers.unshift(errorBandLayer);
      } else {
        // Error bar layer (original implementation)
        const errorBarLayer = {
          mark: {
            type: 'rule',
            color: opts.errorBarColor,
            strokeWidth: 1
          },
          encoding: {
            x: {
              field: opts.independentVariable,
              type: 'temporal' as const
            },
            y: {
              field: opts.minVariable,
              type: 'quantitative' as const
            },
            y2: {
              field: opts.maxVariable,
              type: 'quantitative' as const
            },
            tooltip: [
              { field: opts.independentVariable, type: 'temporal' as const },
              { field: opts.minVariable, type: 'quantitative' as const, title: 'Min' },
              { field: opts.maxVariable, type: 'quantitative' as const, title: 'Max' }
            ]
          }
        };

        layers.push(errorBarLayer);
      }

      // Add min/max to main line tooltip
      lineLayer.encoding.tooltip.push(
        { field: opts.minVariable, type: 'quantitative' as const },
        { field: opts.maxVariable, type: 'quantitative' as const }
      );
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
watch([dataPoints, options], () => {
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