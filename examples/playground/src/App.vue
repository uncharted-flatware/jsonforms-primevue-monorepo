declare module 'simple-code-editor';

<script setup lang="ts">
import { computed, defineComponent, reactive, ref, shallowRef, watch } from "vue";
import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue";
import { createAjv } from '@jsonforms/core';
import {
    defaultStyles,
    mergeStyles,
    vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import 'highlight.js';
// @ts-ignore
import CodeEditor from 'simple-code-editor';
import 'primeicons/primeicons.css';
import primeVueRenderers from '@unchartedsoftware/jsonforms-primevue';
import { customRenderers } from './renderers';
import InputText from 'primevue/inputtext';
import dataSchemaJson from './schemas/dataSchema.json';
import uiSchemaJson from './schemas/uiSchema.json';
import exampleDataJson from './schemas/exampleData.json';

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

defineOptions({
    name: "App"
});

const errorMessage = ref('');

const dataSchemaString = ref(JSON.stringify(dataSchemaJson, null, 2));

const uiSchemaString = ref(JSON.stringify(uiSchemaJson, null, 2));

const exampleDataString = ref(JSON.stringify(exampleDataJson, null, 2));


// Something that has to be done to support `default` in the data_schema
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
    console.debug('onFormChanged: ', event.data);
}

</script>

<template>
    <div class="flex flex-column max-h-full gap-3">

        <h1>JSON Forms Playground</h1>
        
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
<!--                <div v-if="errorMessage.length > 0" class="debug-box">-->
<!--                    {{ errorMessage }}-->
<!--                </div>-->
                <JsonForms
                    :data="exampleData"
                    :renderers="renderers"
                    :schema="dataSchema"
                    :uischema="uiSchema"
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
