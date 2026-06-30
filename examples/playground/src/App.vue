declare module 'simple-code-editor';

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from "vue";
import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue";
import { createAjv } from '@jsonforms/core';
import {
    vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import 'highlight.js';
// @ts-ignore
import CodeEditor from 'simple-code-editor';
import 'primeicons/primeicons.css';
import primeVueRenderers from '@uncharted.software/jsonforms-primevue';
import { customRenderers } from './renderers';
import Select from 'primevue/select';
import { playgroundExamples } from './examples/loadPlaygroundExamples';
import { playgroundDisplayOnlyOnInitMiddleware } from './middleware/displayOnlyOnInitMiddleware';

defineOptions({
    name: "App"
});

const exampleOptions = playgroundExamples.map((ex) => ({
    label: ex.meta.label,
    value: ex.id,
}));

const selectedExampleId = ref(playgroundExamples[0]?.id ?? '');

const activeExample = computed(() =>
    playgroundExamples.find((ex) => ex.id === selectedExampleId.value)
);

const errorMessage = ref('');

const dataSchemaString = ref('');
const uiSchemaString = ref('');
const exampleDataString = ref('');

function applyExampleToEditors(id: string) {
    const ex = playgroundExamples.find((e) => e.id === id);
    if (!ex) return;
    errorMessage.value = '';
    dataSchemaString.value = JSON.stringify(ex.dataSchema, null, 2);
    uiSchemaString.value = JSON.stringify(ex.uiSchema, null, 2);
    exampleDataString.value = JSON.stringify(ex.data, null, 2);
}

watch(
    selectedExampleId,
    (id) => applyExampleToEditors(id),
    { immediate: true }
);

const handleDefaultsAjv = shallowRef(createAjv({ useDefaults: true }));

const dataSchema = computed(() => {
    try {
        return JSON.parse(dataSchemaString.value);
    } catch (error) {
        errorMessage.value = `Data schema JSON parsing error. ${error}`;
    }
});
const uiSchema = computed(() => {
    try {
        return JSON.parse(uiSchemaString.value);
    } catch (error) {
        errorMessage.value = `UI schema JSON parsing error. ${error}`;
    }
});
const exampleData = computed(() => {
    try {
        return JSON.parse(exampleDataString.value);
    } catch (error) {
        errorMessage.value = `Example Data JSON parsing error. ${error}`;
    }
});

const formMiddleware = computed(() =>
    selectedExampleId.value === 'middleware-display-only-on-init'
        ? playgroundDisplayOnlyOnInitMiddleware
        : undefined
);

const renderers = Object.freeze([
    ...primeVueRenderers,
    ...vanillaRenderers,
    ...customRenderers
]);

function onFormChanged(event: JsonFormsChangeEvent) {
    if (event.errors && event.errors.length > 0) {
        console.error(event.errors)
    } else {
        exampleDataString.value = event.data ? JSON.stringify(event.data, null, 2) : '';
    }
}

</script>

<template>
    <div class="flex flex-column max-h-full gap-3">

        <h1>JSON Forms Playground</h1>

        <div class="flex flex-row align-items-center gap-2">
            <label for="example-select" class="font-semibold">Example</label>
            <Select
                input-id="example-select"
                v-model="selectedExampleId"
                :options="exampleOptions"
                option-label="label"
                option-value="value"
                class="w-full md:w-30rem"
            />
        </div>

        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        
        <div class="flex flex-row align-content-flex-start max-w-full gap=3">
            <div class="flex flex-column flex-grow-0 m3">
                <h3>Data Schema</h3>
                <CodeEditor
                    :languages="[['json', 'JSON']]"
                    width="650px"
                    height="400px"
                    font-size="12px"
                    :line-nums="true"
                    v-model="dataSchemaString"
                />
                <h3>UI Schema</h3>
                <CodeEditor
                    :languages="[['json', 'JSON']]"
                    width="650px"
                    height="400px"
                    font-size="12px"
                    :line-nums="true"
                    v-model="uiSchemaString"
                />
                <h3>Example Data</h3>
                <CodeEditor
                    :languages="[['json', 'JSON']]"
                    width="650px"
                    height="400px"
                    font-size="12px"
                    :line-nums="true"
                    v-model="exampleDataString"
                />
            </div>
            <div class="form-container p-3">
                <h3>Rendered Form</h3>

                <JsonForms
                    v-if="activeExample"
                    :key="selectedExampleId"
                    :data="exampleData"
                    :renderers="renderers"
                    :schema="dataSchema"
                    :uischema="uiSchema"
                    :middleware="formMiddleware"
                    @change="onFormChanged"
                    :ajv="handleDefaultsAjv"
                />
            </div>
        </div>
        <div class="footer">

        </div>
    </div>
</template>


<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.form-container {
    width: 800px;
    background-color: var(--surface-ground);
}

.footer {
    height: 40px;
}
</style>
