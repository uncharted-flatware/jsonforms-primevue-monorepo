<template>
  <ControlWrapper
    v-bind="controlWrapper"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <div>
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

// Extract chart configuration from options with PrimeVue theme defaults
const chartOptions = computed(() => {
  // Get CSS custom property values from the document
  const rootStyles = getComputedStyle(document.documentElement);
  
  return {
    title: appliedOptions.value.title || 'Line Chart',
    width: appliedOptions.value.width || 600,
    height: appliedOptions.value.height || 300,
    // Use PrimeVue theme colors instead of uiSchema options
    lineColor: rootStyles.getPropertyValue('--primary-color').trim() || '#818cf8',
    errorBarColor: rootStyles.getPropertyValue('--surface-400').trim() || '#a1a1aa',
    errorBandColor: rootStyles.getPropertyValue('--primary-200').trim() || '#c9cefc',
    errorBandOpacity: 0.5,
    showAsErrorBand: appliedOptions.value.showAsErrorBand || false
  };
});

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
  
  // Get additional theme colors from CSS custom properties
  const rootStyles = getComputedStyle(document.documentElement);
  const backgroundColor = rootStyles.getPropertyValue('--surface-card').trim() || '#18181b';
  const textColor = rootStyles.getPropertyValue('--text-color').trim() || '#ffffff';
  const gridColor = rootStyles.getPropertyValue('--surface-border').trim() || '#27272a';
  
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
        title: enc.x.title || (enc.x.field.charAt(0).toUpperCase() + enc.x.field.slice(1)),
        axis: {
          labelColor: textColor,
          titleColor: textColor,
          gridColor: gridColor,
          domainColor: gridColor
        }
      },
      y: {
        field: enc.y.field,
        type: enc.y.type,
        title: enc.y.title || (enc.y.field.charAt(0).toUpperCase() + enc.y.field.slice(1)),
        axis: {
          labelColor: textColor,
          titleColor: textColor,
          gridColor: gridColor,
          domainColor: gridColor
        }
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
      title: enc.color.title || enc.color.field,
      legend: {
        labelColor: textColor,
        titleColor: textColor
      }
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
        // Error band layer using area mark with actual data values
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
              type: enc.x.type,
              axis: {
                labelColor: textColor,
                titleColor: textColor,
                gridColor: gridColor,
                domainColor: gridColor
              }
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
        // Create connected error bounds using line layers with actual data values
        if (enc.yError && enc.yError2) {
          // Upper bound line using actual yError2 values
          const upperBoundLayer = {
            mark: {
              type: 'line',
              color: opts.errorBarColor,
              strokeWidth: 1,
              strokeDash: [3, 3],
              interpolate: 'linear'
            },
            encoding: {
              x: {
                field: enc.x.field,
                type: enc.x.type,
                axis: {
                  labelColor: textColor,
                  titleColor: textColor,
                  gridColor: gridColor,
                  domainColor: gridColor
                }
              },
              y: {
                field: enc.yError2.field,
                type: enc.yError2.type
              },
              tooltip: [
                { field: enc.x.field, type: enc.x.type },
                { field: enc.yError2.field, type: enc.yError2.type, title: 'Upper Bound' }
              ]
            }
          };

          // Lower bound line using actual yError values
          const lowerBoundLayer = {
            mark: {
              type: 'line',
              color: opts.errorBarColor,
              strokeWidth: 1,
              strokeDash: [3, 3],
              interpolate: 'linear'
            },
            encoding: {
              x: {
                field: enc.x.field,
                type: enc.x.type,
                axis: {
                  labelColor: textColor,
                  titleColor: textColor,
                  gridColor: gridColor,
                  domainColor: gridColor
                }
              },
              y: {
                field: enc.yError.field,
                type: enc.yError.type
              },
              tooltip: [
                { field: enc.x.field, type: enc.x.type },
                { field: enc.yError.field, type: enc.yError.type, title: 'Lower Bound' }
              ]
            }
          };

          // Add both bound lines before the main line
          layers.push(upperBoundLayer);
          layers.push(lowerBoundLayer);

        } else if (enc.yError) {
          // Single error field - create symmetric error bars using actual values
          // This assumes yError contains the error magnitude, not absolute bounds
          const errorBarLayer = {
            mark: {
              type: 'errorbar',
              color: opts.errorBarColor,
              ticks: true
            },
            encoding: {
              x: {
                field: enc.x.field,
                type: enc.x.type,
                axis: {
                  labelColor: textColor,
                  titleColor: textColor,
                  gridColor: gridColor,
                  domainColor: gridColor
                }
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
          title: enc.yError.title || 'Error Lower'
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
    title: {
      text: opts.title,
      color: textColor
    },
    width: opts.width,
    height: opts.height,
    background: backgroundColor,
    view: {
      stroke: null
    },
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