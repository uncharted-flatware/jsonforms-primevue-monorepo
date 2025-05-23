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

// mergeStyles combines all classes from both styles definitions into one
const myStyles = mergeStyles(defaultStyles, { control: { label: "mylabel" } });

defineOptions({
    name: "App"
});

const errorMessage = ref('');
const testValue = ref('Hello World - This should appear in all three inputs!');

const dataSchemaString = ref(JSON.stringify({
    properties: {
        scenarioName: {
            type: "string",
            minLength: 1,
            title: "",
            description: "A unique name to identify this scenario for easy reference later",
            "default": "Untitled What-if"
        },
        tags: {
            type: "array",
            items: {
                type: "string"
            },
            description: "Tags to categorize this scenario"
        },
        simpleNumbers: {
            type: "array",
            title: "Simple Numbers Array",
            description: "An array of numbers with sort buttons",
            items: {
                type: "number"
            }
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
                },
                "tasks": {
                    type: "array",
                    title: "Task List",
                    description: "A list of tasks with different properties",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                title: "Task Name",
                                description: "The name of the task"
                            },
                            priority: {
                                type: "string",
                                enum: ["Low", "Medium", "High"],
                                title: "Priority",
                                description: "The priority level of the task"
                            },
                            isCompleted: {
                                type: "boolean",
                                title: "Completed",
                                description: "Whether the task is completed"
                            },
                            dueDate: {
                                type: "string",
                                format: "date-time",
                                title: "Due Date",
                                description: "When the task is due"
                            }
                        },
                        required: ["name", "priority"]
                    }
                },
                "advancedTasks": {
                    type: "array",
                    title: "Advanced Task List",
                    description: "A list of tasks with custom layout",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                title: "Task Name",
                                description: "The name of the task"
                            },
                            priority: {
                                type: "string",
                                enum: ["Low", "Medium", "High"],
                                title: "Priority",
                                description: "The priority level of the task"
                            },
                            isCompleted: {
                                type: "boolean",
                                title: "Completed",
                                description: "Whether the task is completed"
                            },
                            dueDate: {
                                type: "string",
                                format: "date-time",
                                title: "Due Date",
                                description: "When the task is due"
                            }
                        },
                        required: ["name", "priority"]
                    }
                },
                "readOnlyTasks": {
                    type: "array",
                    title: "Read-Only Task List",
                    description: "A read-only list of preset tasks",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                title: "Task Name",
                                description: "The name of the task"
                            },
                            priority: {
                                type: "string",
                                enum: ["Low", "Medium", "High"],
                                title: "Priority",
                                description: "The priority level of the task"
                            },
                            isCompleted: {
                                type: "boolean",
                                title: "Completed",
                                description: "Whether the task is completed"
                            },
                            dueDate: {
                                type: "string",
                                format: "date-time",
                                title: "Due Date",
                                description: "When the task is due"
                            }
                        },
                        required: ["name", "priority"]
                    }
                }
            }
        },
        displayOnlyTest: {
            type: "object",
            properties: {
                stringValue: {
                    type: "string",
                    title: "String Value",
                    description: "A string value for display-only testing"
                },
                numberValue: {
                    type: "number",
                    title: "Number Value",
                    description: "A number value for display-only testing"
                },
                integerValue: {
                    type: "integer",
                    title: "Integer Value",
                    description: "An integer value for display-only testing",
                    minimum: 0,
                    maximum: 100
                },
                booleanValue: {
                    type: "boolean",
                    title: "Boolean Value",
                    description: "A boolean value for display-only testing"
                },
                enumValue: {
                    type: "string",
                    title: "Enum Value",
                    description: "An enum value for display-only testing",
                    enum: ["Option 1", "Option 2", "Option 3"]
                },
                dateTimeValue: {
                    type: "string",
                    title: "Date/Time Value",
                    description: "A date/time value for display-only testing",
                    format: "date-time"
                },
                durationValue: {
                    type: "string",
                    title: "Duration Value",
                    description: "A duration value for display-only testing",
                    format: "duration"
                },
                arrayValue: {
                    type: "array",
                    title: "Array Value",
                    description: "An array for display-only testing",
                    items: {
                        type: "string"
                    }
                },
                objectArrayValue: {
                    type: "array",
                    title: "Object Array Value",
                    description: "An object array for display-only testing",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                title: "Name"
                            },
                            status: {
                                type: "string",
                                title: "Status"
                            }
                        }
                    }
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
            label: "2. Tags",
            options: {
                isToggleable: true,
                isExpanded: true
            },
            elements: [
                {
                    type: "Label",
                    text: "Add tags to help categorize and find this scenario later."
                },
                {
                    type: "Control",
                    scope: "#/properties/tags",
                    options: {
                        emptyMessage: "No tags added yet"
                    }
                },
                {
                    type: "Label",
                    text: "Simple Numbers Array with Sort Buttons"
                },
                {
                    type: "Control",
                    scope: "#/properties/simpleNumbers",
                    options: {
                        showSortButtons: true,
                        emptyMessage: "No numbers added yet"
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
                isToggleable: true,
                isExpanded: true
            },
            elements: [
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aDateTime"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aDuration"
                },
                {
                    type: "Label",
                    text: "Task List Example with showSortButtons and elementLabelProp"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/tasks",
                    options: {
                        elementLabelProp: "name",
                        emptyMessage: "No tasks added yet",
                        showSortButtons: true,
                        detail: "GENERATED"
                    }
                },
                {
                    type: "Label",
                    text: "Task List with Custom Detail UI Schema"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/advancedTasks",
                    options: {
                        elementLabelProp: "name",
                        emptyMessage: "No advanced tasks added yet",
                        showSortButtons: true,
                        detail: {
                            type: "HorizontalLayout",
                            elements: [
                                {
                                    type: "VerticalLayout",
                                    elements: [
                                        {
                                            type: "Control",
                                            scope: "#/properties/name"
                                        },
                                        {
                                            type: "Control",
                                            scope: "#/properties/priority"
                                        }
                                    ]
                                },
                                {
                                    type: "VerticalLayout",
                                    elements: [
                                        {
                                            type: "Control",
                                            scope: "#/properties/isCompleted"
                                        },
                                        {
                                            type: "Control",
                                            scope: "#/properties/dueDate"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    type: "Label",
                    text: "Read-Only Task List Example"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/readOnlyTasks",
                    options: {
                        elementLabelProp: "name",
                        emptyMessage: "No tasks available",
                        detail: "GENERATED",
                        readonly: true
                    }
                }
            ]
        },
        {
            type: "Group",
            label: "Display-Only Test",
            options: {
                isToggleable: true,
                isExpanded: true
            },
            elements: [
                {
                    type: "Label",
                    text: "This section demonstrates components in display-only mode (without form controls)"
                },
                {
                    type: "VerticalLayout",
                    elements: [
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/stringValue",
                            options: {
                                displayOnly: true
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/numberValue",
                            options: {
                                displayOnly: true,
                                prefix: "$",
                                suffix: " USD"
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/integerValue",
                            options: {
                                displayOnly: true,
                                prefix: "#",
                                suffix: " items"
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/booleanValue",
                            options: {
                                displayOnly: true
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/enumValue",
                            options: {
                                displayOnly: true
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/dateTimeValue",
                            options: {
                                displayOnly: true
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/durationValue",
                            options: {
                                displayOnly: true
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/arrayValue",
                            options: {
                                displayOnly: true,
                                emptyMessage: "No items to display"
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/objectArrayValue",
                            options: {
                                displayOnly: true,
                                elementLabelProp: "name",
                                emptyMessage: "No objects to display"
                            }
                        }
                    ]
                }
            ]
        }
    ]
    ,
}, null, 2));

const exampleDataString = ref(JSON.stringify({
    "tags": ["test-tag", "another-tag"],
    "simpleNumbers": [10, 25, 5, 40, 15],
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
    "testing": {
        "tasks": [
            {
                "name": "Setup Development Environment",
                "priority": "High",
                "isCompleted": false,
                "dueDate": "2024-03-26T09:00:00Z"
            },
            {
                "name": "Write Unit Tests",
                "priority": "Medium",
                "isCompleted": true,
                "dueDate": "2024-03-24T16:00:00Z"
            }
        ],
        "advancedTasks": [
            {
                "name": "Design System Architecture",
                "priority": "High",
                "isCompleted": false,
                "dueDate": "2024-03-28T14:00:00Z"
            },
            {
                "name": "Performance Optimization",
                "priority": "Medium",
                "isCompleted": false,
                "dueDate": "2024-03-30T11:00:00Z"
            },
            {
                "name": "Security Audit",
                "priority": "High",
                "isCompleted": true,
                "dueDate": "2024-03-25T13:00:00Z"
            }
        ],
        "readOnlyTasks": [
            {
                "name": "Review Pull Requests",
                "priority": "High",
                "isCompleted": true,
                "dueDate": "2024-03-20T10:00:00Z"
            },
            {
                "name": "Update Documentation",
                "priority": "Medium",
                "isCompleted": false,
                "dueDate": "2024-03-22T15:00:00Z"
            },
            {
                "name": "Fix Critical Bug",
                "priority": "High",
                "isCompleted": false,
                "dueDate": "2024-03-21T12:00:00Z"
            },
            {
                "name": "Code Review",
                "priority": "Low",
                "isCompleted": true,
                "dueDate": "2024-03-19T16:00:00Z"
            }
        ]
    },
    "displayOnlyTest": {
        "stringValue": "This is a display-only string value",
        "numberValue": 1234.56,
        "integerValue": 42,
        "booleanValue": true,
        "enumValue": "Option 2",
        "dateTimeValue": "2024-03-25T14:30:00Z",
        "durationValue": "P7D",
        "arrayValue": [
            "First item",
            "Second item",
            "Third item"
        ],
        "objectArrayValue": [
            {
                "name": "Project Alpha",
                "status": "Active"
            },
            {
                "name": "Project Beta",
                "status": "Completed"
            },
            {
                "name": "Project Gamma",
                "status": "Pending"
            }
        ]
    }
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
        
        <!-- SANITY TEST: PrimeVue InputText disabled behavior -->
        <div class="p-3 border-1 border-300 border-round" style="background-color: #f8f9fa;">
            <h3>Sanity Test: Disabled InputText Behavior</h3>
            <div class="flex flex-column gap-2">
                <div>
                    <label>Enabled Input:</label>
                    <InputText v-model="testValue" />
                </div>
                <div>
                    <label>Disabled Input (should show value):</label>
                    <InputText v-model="testValue" :disabled="true" />
                </div>
                <div>
                    <label>Readonly Input (should show value):</label>
                    <InputText v-model="testValue" :readonly="true" />
                </div>
                <div>Current value: {{ testValue }}</div>
            </div>
        </div>
        
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
