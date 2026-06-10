import { readFileSync, writeFileSync } from 'fs';

// Read the generated CSS file
const cssFile = './dist/jsonforms-primevue.css';
const css = readFileSync(cssFile, 'utf-8');

// Wrap all global (non-scoped) selectors with .jsonforms-container
// Split by data-v- attributes to identify scoped vs non-scoped rules
const wrapped = css.replace(
  // Match global selectors that don't have [data-v-...] attributes
  /([^}]*?)(\{[^}]*\})/g,
  (match, selector, rules) => {
    // If it already has a data-v- attribute, it's scoped - leave it alone
    if (selector.includes('[data-v-')) {
      return match;
    }
    // If it's a global selector, wrap it with .jsonforms-container
    // Make sure not to double-wrap
    if (selector.includes('.jsonforms-container')) {
      return match;
    }
    return selector.split(',').map(s => `.jsonforms-container ${s.trim()}`).join(', ') + rules;
  }
);

writeFileSync(cssFile, wrapped, 'utf-8');
console.log('✅ Wrapped global CSS selectors with .jsonforms-container');
