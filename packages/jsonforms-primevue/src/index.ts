// src/index.js
import renderers from './renderers';
import StringControlRenderer from './renderers/StringControlRenderer.vue';
import NumberControlRenderer from './renderers/NumberControlRenderer.vue';
import BooleanControlRenderer from './renderers/BooleanControlRenderer.vue';
import VerticalLayoutRenderer from './renderers/VerticalLayoutRenderer.vue';

export {
  StringControlRenderer,
  NumberControlRenderer,
  BooleanControlRenderer,
  VerticalLayoutRenderer,
};

export default renderers;
