import {
  rankWith,
  and,
  isObjectArrayControl,
  hasOption,
  optionIs,
} from "@jsonforms/core";
import LineChartRenderer from "./LineChartRenderer.vue";

// Tester for line chart data (array with encoding options)
const lineChartTester = rankWith(
  4, // Higher rank than default renderers
  and(
    isObjectArrayControl,
    optionIs("displayOnly", true),
    hasOption("encoding")
  )
);

export const customRenderers = [
  { tester: lineChartTester, renderer: LineChartRenderer },
];
