<template>
    <div class="p-field">
        <label v-if="label" :for="id">{{ label }}</label>
        <InputNumber
            :id="id"
            :value="data.value"
            @input="onChange($event.value)"
            :placeholder="description"
            mode="decimal"
        />
        <small v-if="!isValid" class="p-error">{{ errorMessage }}</small>
    </div>
</template>

<script lang="ts">
import { computed } from 'vue';
import InputNumber from 'primevue/inputnumber';
import { useJsonFormsControl } from '@jsonforms/vue';

export default {
    name: 'NumberControlRenderer',
    components: {
        InputNumber,
    },
    props: ['uischema', 'schema', 'path', 'enabled', 'id', 'visible'],
    setup(props) {
        const {
            data,
            handleChange,
            errors,
            label,
            description,
            required,
        } = useJsonFormsControl(props);

        const isValid = computed(() => errors.value.length === 0);
        const errorMessage = computed(() => errors.value.join('\n'));

        const onChange = (value) => {
            handleChange(props.path, value);
        };

        return {
            data,
            handleChange,
            errors,
            label,
            description,
            required,
            isValid,
            errorMessage,
            onChange,
        };
    },
};
</script>
