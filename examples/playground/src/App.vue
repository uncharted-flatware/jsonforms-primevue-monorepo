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
        testing: {
            type: "object",
            properties: {
                "aString": {
                    type: "string",
                    title: "String Value",
                    description: "A simple string input"
                },
                "aNumber": {
                    type: "number",
                    title: "Number Value",
                    description: "A number input with currency formatting"
                },
                "anInteger": {
                    type: "integer",
                    title: "Integer Value",
                    description: "An integer input with item count formatting",
                    minimum: 0,
                    maximum: 100
                },
                "aBoolean": {
                    type: "boolean",
                    title: "Boolean Value",
                    description: "A boolean toggle"
                },
                "anEnum": {
                    type: "string",
                    title: "Enum Value",
                    description: "A dropdown with predefined options",
                    enum: ["Option 1", "Option 2", "Option 3"]
                },
                "aDateTime": {
                    type: "string",
                    title: "Date Time",
                    format: "date-time"
                },
                "aDuration": {
                    type: "string",
                    title: "Duration",
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
                "anObject": {
                    type: "object",
                    title: "Object Example",
                    description: "An example of an object control",
                    properties: {
                        name: {
                            type: "string",
                            title: "Name",
                            description: "The name of the object"
                        },
                        description: {
                            type: "string",
                            title: "Description",
                            description: "A description of the object"
                        },
                        tags: {
                            type: "array",
                            title: "Tags",
                            description: "Tags associated with the object",
                            items: {
                                type: "string"
                            }
                        }
                    }
                },
                "labelExamples": {
                    type: "object",
                    title: "Label Examples",
                    description: "Examples of different label types and options",
                    properties: {
                        "basicLabel": {
                            type: "string",
                            title: "Basic Label Example",
                            description: "A simple string input with a basic label"
                        },
                        "imageLabel": {
                            type: "string",
                            title: "Image Label Example",
                            description: "A string input with a label that includes an image"
                        },
                        "styledLabel": {
                            type: "string",
                            title: "Styled Label Example",
                            description: "A string input with a styled label"
                        }
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
                numberArrayValue: {
                    type: "array",
                    title: "Number Array Value",
                    description: "A number array for display-only testing",
                    items: {
                        type: "number"
                    }
                },
                booleanArrayValue: {
                    type: "array",
                    title: "Boolean Array Value",
                    description: "A boolean array for display-only testing",
                    items: {
                        type: "boolean"
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
    }
}, null, 2));

const uiSchemaString = ref(JSON.stringify({
    type: "VerticalLayout",
    elements: [
        {
            type: "Group",
            label: "Basic Controls",
            options: {
                isToggleable: true,
                isExpanded: false
            },
            elements: [
                {
                    type: "Label",
                    text: "String Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aString",
                    options: {
                        placeholder: "Enter a string value"
                    }
                },
                {
                    type: "Label",
                    text: "Number Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aNumber",
                    options: {
                        prefix: "$",
                        suffix: " USD"
                    }
                },
                {
                    type: "Label",
                    text: "Integer Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/anInteger",
                    options: {
                        prefix: "#",
                        suffix: " items"
                    }
                },
                {
                    type: "Label",
                    text: "Boolean Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aBoolean"
                },
                {
                    type: "Label",
                    text: "Enum Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/anEnum"
                },
                {
                    type: "Label",
                    text: "Date-Time Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aDateTime"
                },
                {
                    type: "Label",
                    text: "Duration Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/aDuration"
                }
            ]
        },
        {
            type: "Group",
            label: "Complex Controls",
            options: {
                isToggleable: true,
                isExpanded: false
            },
            elements: [
                {
                    type: "Label",
                    text: "Array Control - Default Detail"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/tasks",
                    options: {
                        elementLabelProp: "name",
                        emptyMessage: "No tasks added yet",
                        showSortButtons: true,
                        detail: "DEFAULT"
                    }
                },
                {
                    type: "Label",
                    text: "Array Control - Generated Detail"
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
                    text: "Array Control - Custom Layout"
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
                    text: "Object Control"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/anObject"
                }
            ]
        },
        {
            type: "Group",
            label: "Layout Components",
            options: {
                isToggleable: true,
                isExpanded: false
            },
            elements: [
                {
                    type: "Label",
                    text: "Group Layout (Accordion)"
                },
                {
                    type: "Group",
                    label: "Accordion Example",
                    options: {
                        asAccordion: true,
                        isExpanded: true
                    },
                    elements: [
                        {
                            type: "Control",
                            scope: "#/properties/testing/properties/aString"
                        },
                        {
                            type: "Control",
                            scope: "#/properties/testing/properties/aNumber"
                        }
                    ]
                },
                {
                    type: "Label",
                    text: "Horizontal Layout"
                },
                {
                    type: "HorizontalLayout",
                    elements: [
                        {
                            type: "Control",
                            scope: "#/properties/testing/properties/aString"
                        },
                        {
                            type: "Control",
                            scope: "#/properties/testing/properties/aNumber"
                        }
                    ]
                },
                {
                    type: "Label",
                    text: "Vertical Layout"
                },
                {
                    type: "VerticalLayout",
                    elements: [
                        {
                            type: "Control",
                            scope: "#/properties/testing/properties/aString"
                        },
                        {
                            type: "Control",
                            scope: "#/properties/testing/properties/aNumber"
                        }
                    ]
                }
            ]
        },
        {
            type: "Group",
            label: "Display-Only Examples",
            options: {
                isToggleable: true,
                isExpanded: false
            },
            elements: [
                {
                    type: "Label",
                    text: "Basic Controls in Display Mode"
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
                        }
                    ]
                },
                {
                    type: "Label",
                    text: "Complex Controls in Display Mode"
                },
                {
                    type: "VerticalLayout",
                    elements: [
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
                            scope: "#/properties/displayOnlyTest/properties/numberArrayValue",
                            options: {
                                displayOnly: true,
                                emptyMessage: "No items to display"
                            }
                        },
                        {
                            type: "Control",
                            scope: "#/properties/displayOnlyTest/properties/booleanArrayValue",
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
                                emptyMessage: "No objects to display",
                                detail: "GENERATED"
                            }
                        }
                    ]
                }
            ]
        },
        {
            type: "Group",
            label: "Label Examples",
            options: {
                isToggleable: true,
                isExpanded: false
            },
            elements: [
                {
                    type: "Label",
                    text: "Basic Label"
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/labelExamples/properties/basicLabel"
                },
                {
                    type: "Label",
                    text: "Label with Image",
                    options: {
                        imageUrl: "https://primevue.org/images/logo.svg",
                        imageWidth: 100,
                        imageHeight: 50
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/labelExamples/properties/imageLabel"
                },
                {
                    type: "Label",
                    text: "Styled Label with Image",
                    options: {
                        imageUrl: "https://primevue.org/images/logo.svg",
                        imageWidth: 50,
                        imageHeight: 50
                    }
                },
                {
                    type: "Control",
                    scope: "#/properties/testing/properties/labelExamples/properties/styledLabel"
                }
            ]
        }
    ]
}, null, 2));

const exampleDataString = ref(JSON.stringify({
    "testing": {
        "aString": "Example string value",
        "aNumber": 1234.56,
        "anInteger": 42,
        "aBoolean": true,
        "anEnum": "Option 2",
        "aDateTime": "2024-03-25T14:30:00Z",
        "aDuration": "P7D",
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
            }
        ],
        "anObject": {
            "name": "Example Object",
            "description": "This is an example object with various properties",
            "tags": ["example", "test", "demo"]
        },
        "labelExamples": {
            "basicLabel": "Basic label example value",
            "imageLabel": "Image label example value",
            "styledLabel": "Styled label example value"
        }
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
        "numberArrayValue": [
            1, 2, 3, 4, 5
        ],
        "booleanArrayValue": [
            true, false, true, false, true
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
