<script setup lang="ts">
import { computed, defineComponent, reactive, ref, shallowRef, watch } from "vue";
import { JsonForms, JsonFormsChangeEvent } from "@jsonforms/vue";
import {
    defaultStyles,
    mergeStyles,
    vanillaRenderers,
} from "@jsonforms/vue-vanilla";
import 'highlight.js';
import CodeEditor from 'simple-code-editor';
import primeVueRenderers from 'jsonforms-primevue';

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

defineOptions({
    name: "App"
});

const errorMessage = ref('');

const dataSchemaString = ref(JSON.stringify({
    properties: {
        scenarioName: {
            type: "string",
            minLength: 1,
            title: ""
        },
        startingDamage: {
            type: "object",
            properties: {
                method: {
                    "type": "string",
                    "title": "",
                    "enum": [
                        "Use a saved snapshot",
                        "Randomized"
                    ]
                },
                savedSnapshot: {
                    type: "string",
                    title: "",
                    description: "Use the visible nodes from a saved snapshot selection"
                },
                severity: {
                    type: "number",
                    title: "Damage severity",
                    minimum: 0,
                    maximum: 100
                }
            }
        },
        damagePropagation: {
            type: "object",
            properties: {
                weightingType: {
                    type: "string",
                    enum: [
                        "None",
                        "Count",
                        "Dollar value"
                    ]
                },
                isWhenEnabled: {
                    type: "boolean",
                    title: ""
                },
                whenPercentageOfInputsFail: {
                    type: "integer",
                    title: "",
                    minimum: 0,
                    maximum: 100
                },
                thenNodeFailsWithinPercentage: {
                    type: "integer",
                    title: "",
                    minimum: 0,
                    maximum: 100
                },
                afterNumberOfSteps: {
                    type: "integer",
                    title: "",
                    minimum: 1,
                    maximum: 5 // What should it be?
                },
                isUseHierarchicalDependenciesEnabled: {
                    type: "boolean",
                    title: ""
                },
                hierarchicalDependenciesOption: {
                    type: "string",
                    enum: [
                        "Second parent"
                    ]
                }
            }
        },
        numberOfRuns: {
            type: "integer",
            title: "Number of runs",
            minimum: 1,
            maximum: 1000
        }
    },
}, null, 2));

const uiSchemaString = ref(JSON.stringify({
    type: "VerticalLayout",
    elements: [
        {
            type: "Group",
            label: "1. Scenario name",
            elements: [
                {
                    type: "Label",
                    text:  "Give your what-if scenario a name so you can easily identify it later."
                },
                {
                    type: "Control",
                    scope: "#/properties/scenarioName",
                }
            ]
        },
        {
            type: "Group",
            label: "2. Starting damage",
            elements: [
                {
                    type: "Label",
                    text:  "Which nodes in the network are broken at the beginning of the simulation?"
                },
                {
                    type: "Control",
                    scope: "#/properties/startingDamage/properties/method",
                    options: {
                        format: "radio"
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/startingDamage/properties/severity"
                }
            ]
        },
        {
            type: "Group",
            label: "3. Damage propagation",
            elements: [
                {
                    type: "Label",
                    text: "Tell the algorithm what causes the successive dominoes to fall."
                },
                {
                    type: "Control",
                    scope: "#/properties/damagePropagation/properties/weightingType"
                },
                {
                    type: "HorizontalLayout",
                    elements: [
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/isWhenEnabled"
                        },
                        {
                            type: "Label",
                            text: "When more than"
                        },
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/whenPercentageOfInputsFail"
                        },
                        {
                            type: "Label",
                            text: "% of node inputs fail then the node fails ±"
                        },
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/thenNodeFailsWithinPercentage"
                        },
                        {
                            type: "Label",
                            text: "% after"
                        },
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/afterNumberOfSteps"
                        },
                        {
                            type: "Label",
                            text: "steps."
                        }
                    ]
                },
                {
                    type: "VerticalLayout",
                    elements: [
                        {
                            type: "HorizontalLayout",
                            elements: [
                                {
                                    type: "Control",
                                    scope: "#/properties/damagePropagation/properties/isUseHierarchicalDependenciesEnabled"
                                },
                                {
                                    type: "Label",
                                    text: "Use hierarchical dependencies for"
                                }
                            ]
                        },
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/hierarchicalDependenciesOption"
                        }
                    ]
                }

            ]
        },
        {
            type: "Group",
            label: "4. Reconnection",
            elements: [
                {
                    type: "Label",
                    text: "Tell the algorithm how new edges get formed."
                }
            ]
        },
        {
            type: "Group",
            label: "5. Recovery",
            elements: [
                {
                    type: "Label",
                    text: "Tell the algorithm how things that were broken recover."
                }
            ]
        },
        {
            type: "Group",
            label: "6. How Many simulations?",
            elements: [
                {
                    type: "Label",
                    text: "How many simulations do you want to create? There are various probabilities, so each simulation will be different."
                },
                {
                    type: "Control",
                    scope: "#/properties/numberOfRuns"
                }
            ]
        }
    ]
    ,
}, null, 2));

const exampleDataString = ref(JSON.stringify({
    "scenarioName": "My scenario",
    "damagePropagation": {
        "isWhenEnabled": true
    }
}, null, 2));

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
    ...vanillaRenderers,
    ...primeVueRenderers
]);

function onFormChanged(event: JsonFormsChangeEvent) {
    if (event.errors?.length > 0) {
        console.error(event.errors)
    }
    console.debug('onFormChanged: ', event.data);
}

</script>

<template>
    <div class="display-flex-column height-100pct">

        <h1>JSON Forms Playground</h1>
        <div class="display-flex-row width-100pct">
            <div class="display-flex-column flex-grow-1 margin-default height-80pct vertical-scroll">
                <h3>Data Schema</h3>
                <CodeEditor
                    :languages="[['json', 'JSON']]"
                    width="100%"
                    height="400px"
                    font-size="12px"
                    :line-nums="true"
                    v-model="dataSchemaString"
                />
                <h3>UI Schema</h3>
                <CodeEditor
                    :languages="[['json', 'JSON']]"
                    width="100%"
                    height="400px"
                    font-size="12px"
                    :line-nums="true"
                    v-model="uiSchemaString"
                />
                <h3>Example Data</h3>
                <CodeEditor
                    :languages="[['json', 'JSON']]"
                    width="100%"
                    height="400px"
                    font-size="12px"
                    :line-nums="true"
                    v-model="exampleDataString"
                />
            </div>
            <div class="form-container align-self-flex-start">
                <h3>Rendered Form</h3>
                <div v-if="errorMessage.length > 0" class="debug-box">
                    {{ errorMessage }}
                </div>
                <json-forms
                    :data="exampleData"
                    :renderers="renderers"
                    :schema="dataSchema"
                    :uischema="uiSchema"
                    @change="onFormChanged"
                />
            </div>
        </div>
        <div class="footer">

        </div>
    </div>
</template>


<style>
:root {
    --nav-bar-height: 50px;
    --footer-height: 30px;

    --standard-padding-size: 5px;
    --small-padding-size: 4px;
    --standard-gap: var(--standard-padding-size);
    --small-gap: var(--small-padding-size);
    --standard-heading-height: 30px;

    --standard-border-radius: 8px;
    --spinner-dimension-small: 20px;

    --table-font-size: small;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin: var(--standard-padding-size);
}

.vertical-layout {
    margin-left: 10px;
    margin-right: 10px;
}

.form-container {
    width: 800px;
    margin: 0 auto;
}

.text-area {
    min-height: 80px;
}

.vertical-scroll {
    overflow-y: auto;
}

.horizontal-scroll {
    overflow-x: auto;
}

.text-align-left {
    text-align: left;
}

.display-flex-row-left-justify {
    display: flex;
    flex-direction: row;
    justify-items: left;
}

.display-flex-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--standard-gap);
}

.display-flex-column {
    display: flex;
    flex-direction: column;
    gap: var(--standard-gap);
}

.flex-grow-1 {
    flex-grow: 1;
}

.align-self-flex-start {
    align-self: flex-start;
}

.width-100pct {
    width: 100%;
}

.height-100pct {
    height: 90%;
}

.height-80pct {
    height: 1200px;
}

.small-gap {
    gap: var(--small-gap);
}

.debug-box {
    border-style: solid;
    border-color: red;
    border-width: 2px;
}

.border-green {
    border-color: green;
}

.footer {
    height: 40px;
}
</style>
