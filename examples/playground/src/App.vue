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
import CodeEditor from 'simple-code-editor';
import primeVueRenderers from '@unchartedsoftware/jsonforms-primevue';

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
            title: "",
            description: "A unique name to identify this scenario for easy reference later",
            "default": "Untitled What-if"
        },
        startingDamage: {
            type: "object",
            properties: {
                method: {
                    "type": "string",
                    "title": "",
                    "description": "Choose how to initialize the damage in the network - either from a saved state or randomly generated",
                    "enum": [
                        "Use a saved snapshot",
                        "Randomized"
                    ],
                    "default": "Randomized"
                },
                savedSnapshot: {
                    type: "string",
                    title: "",
                    description: "Use the visible nodes from a saved snapshot selection as the starting point for damage"
                },
                severity: {
                    type: "integer",
                    title: "Damage severity",
                    description: "Controls the percentage of nodes that will be initially damaged in the network",
                    minimum: 0,
                    maximum: 100,
                    default: 10
                }
            }
        },
        damagePropagation: {
            type: "object",
            properties: {
                weightingType: {
                    type: "string",
                    description: "Determines how edge weights are considered in damage propagation calculations",
                    enum: [
                        "None",
                        "Count",
                        "Dollar value"
                    ],
                    "default": "None"
                },
                isWhenEnabled: {
                    type: "boolean",
                    title: "",
                    description: "Enable conditional damage propagation based on input failure percentage"
                },
                whenPercentageOfInputsFail: {
                    type: "integer",
                    title: "",
                    minimum: 0,
                    maximum: 100,
                    "default": 50
                },
                thenNodeFailsWithinPercentage: {
                    type: "integer",
                    title: "",
                    minimum: 0,
                    maximum: 100,
                    "default": 50
                },
                afterNumberOfSteps: {
                    type: "integer",
                    title: "",
                    minimum: 1,
                    maximum: 5, // What should it be?
                    "default": 3
                },
                isUseHierarchicalDependenciesEnabled: {
                    type: "boolean",
                    title: ""
                },
                hierarchicalDependenciesOption: {
                    type: "string",
                    enum: [
                        "First parent",
                        "Second parent"
                    ],
                    "default": "Second parent"
                }
            }
        },
        numberOfRuns: {
            type: "integer",
            title: "Number of runs",
            description: "The total number of simulation iterations to perform - higher values give more statistical confidence but take longer",
            minimum: 1,
            maximum: 1000,
            "default": 100
        },
        testing: {
            type: "object",
            properties: {
                "aDateTime": {
                    type: "string",
                    title: "A Date Time",
                    format: "date-time"
                },
                "aDuration": {
                    type: "string",
                    title: "An ISO time duration",
                    format: "duration"
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
                    text: "Give your what-if scenario a name so you can easily identify it later."
                },
                {
                    type: "Control",
                    scope: "#/properties/scenarioName",
                    label: "Name",
                    options: {
                        labelPlacement: "float",
                        descriptionDisplay: "tooltip"
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
                    text: "This section demonstrates the two description display modes (tooltip and always):"
                },
                {
                    type: "HorizontalLayout",
                    options: {
                        isWrappingEnabled: false
                    },
                    elements: [
                        {
                            type: "VerticalLayout",
                            elements: [
                                {
                                    type: "Label",
                                    text: "Which nodes in the network are broken at the beginning of the simulation?"
                                },
                                {
                                    type: "Control",
                                    scope: "#/properties/startingDamage/properties/method",
                                    label: "Method",
                                    options: {
                                        format: "radio",
                                        descriptionDisplay: "always"
                                    }
                                },
                                {
                                    type: "Control",
                                    scope: "#/properties/startingDamage/properties/savedSnapshot",
                                    label: "Saved Snapshot",
                                    options: {
                                        descriptionDisplay: "tooltip"
                                    }
                                },
                                {
                                    type: "Control",
                                    scope: "#/properties/startingDamage/properties/severity",
                                    label: "Severity",
                                    options: {
                                        suffix: "%",
                                        descriptionDisplay: "tooltip"
                                    }
                                }
                            ]
                        },
                        {
                            type: "Label",
                            text: "See image",
                            options: {
                                imageUrl: '/starting-damage.png',
                                imageWidth: 200,
                                imageHeight: 200
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: "Group",
            label: "3. Damage propagation",
            options: {
                isToggleable: true,
                isExpanded: true
            },
            elements: [
                {
                    type: "Label",
                    text: "Tell the algorithm what causes the successive dominoes to fall."
                },
                {
                    type: "Control",
                    scope: "#/properties/damagePropagation/properties/weightingType",
                    label: "Weighting Type",
                    options: {
                        descriptionDisplay: "always"
                    }
                },
                {
                    type: "HorizontalLayout",
                    elements: [
                        {
                            type: "Control",
                            scope: "#/properties/damagePropagation/properties/isWhenEnabled",
                            label: "Enable Conditional Propagation",
                            options: {
                                descriptionDisplay: "always"
                            }
                        },
                        {
                            type: "HorizontalLayout",
                            options: {
                                isWrappingEnabled: true
                            },
                            elements: [
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
                                    text: "of node inputs fail then the node fails",
                                    options: {
                                        suffix: "%"
                                    }
                                },
                                {
                                    type: "Control",
                                    scope: "#/properties/damagePropagation/properties/thenNodeFailsWithinPercentage",
                                    label: "±",
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
                        }
                    ]
                },
                {
                    type: "VerticalLayout",
                    elements: [
                        {
                            type: "HorizontalLayout",
                            options: {
                                isWrappingEnabled: true
                            },
                            elements: [
                                {
                                    type: "Control",
                                    scope: "#/properties/damagePropagation/properties/isUseHierarchicalDependenciesEnabled",
                                    label: "Use hierarchical dependencies for",
                                    options: {
                                        labelPlacement: "right"
                                    }
                                },
                                {
                                    type: "Control",
                                    scope: "#/properties/damagePropagation/properties/hierarchicalDependenciesOption",
                                    label: "",
                                    rule: {
                                        effect: "DISABLE",
                                        condition: {
                                            scope: "#/properties/damagePropagation/properties/isUseHierarchicalDependenciesEnabled",
                                            schema: { const: false }
                                        }
                                    }
                                }
                            ]
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
                    label: "Number of Runs",
                    options: {
                        "step": 10,
                        descriptionDisplay: "tooltip"
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
                    scope: "#/properties/testing/properties/aDateTime"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aDuration"
                }
            ]
        }
    ]
    ,
}, null, 2));

const exampleDataString = ref(JSON.stringify({
    // "damagePropagation": {
    //     "isUseHierarchicalDependenciesEnabled": false,
    //     "isWhenEnabled": true,
    //     "weightingType": "None",
    //     "whenPercentageOfInputsFail": 3,
    //     "thenNodeFailsWithinPercentage": 3,
    //     "afterNumberOfSteps": 2
    // },
    // "startingDamage": {
    //     "method": "Randomized",
    //     "severity": 5
    // },
    // "numberOfRuns": 10
}, null, 2));


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
