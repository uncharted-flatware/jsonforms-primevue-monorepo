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
                    type: "integer",
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
        },
        testing: {
            type: "object",
            properties: {
                "dateTime": {
                    type: "string",
                    format: "date-time"
                }
            }
        }
    },
}, null, 2));

const uiSchemaString = ref(JSON.stringify({
    type: "VerticalLayout",
    elements: [
        {
            type: "Group",
            label: "1. Scenario name",
            options: {
                isToggleable: true,
                isExpanded: true
            },
            elements: [
                {
                    type: "Label",
                    text:  "Give your what-if scenario a name so you can easily identify it later."
                },
                {
                    type: "Control",
                    scope: "#/properties/scenarioName",
                    label: "Name",
                    options: {
                        labelPlacement: "float"
                    }
                }
            ]
        },
        {
            type: "Group",
            label: "2. Starting damage",
            options: {
                isToggleable: true,
                isExpanded: true
            },
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
                    scope: "#/properties/startingDamage/properties/severity",
                    options: {
                        suffix: "%"
                    }
                }
            ]
        },
        {
            type: "Group",
            label: "3. Damage propagation",
            options: {
                isToggleable: true,
                isExpanded: false
            },
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
                    type: "VerticalLayout",
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
                            scope: "#/properties/damagePropagation/properties/whenPercentageOfInputsFail",
                            options: {
                                suffix: "%"
                            }
                        },
                        {
                            type: "Label",
                            text: "of node inputs fail then the node fails ±",
                            options: {
                                suffix: "%"
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/thenNodeFailsWithinPercentage",
                            options: {
                                suffix: "%"
                            }
                        },
                        {
                            type: "Label",
                            text: "after"
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
            options: {
                isToggleable: true,
                isExpanded: false
            },
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
            options: {
                isToggleable: true,
                isExpanded: false
            },
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
            options: {
                isToggleable: true,
                isExpanded: true
            },
            elements: [
                {
                    type: "Label",
                    text: "How many simulations do you want to create? There are various probabilities, so each simulation will be different."
                },
                {
                    type: "Control",
                    scope: "#/properties/numberOfRuns",
                    options: {
                        "step": 10
                    }
                }
            ]
        },
        {
            type: "Group",
            label: "Test",
            options: {
                isToggleable: true
            },
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/dateTime"
                }
            ]
        }
    ]
    ,
}, null, 2));

const exampleDataString = ref(JSON.stringify({

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
            <div class="form-container m-3">
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
    margin: 0 auto;
}

.footer {
    height: 40px;
}
</style>
