<!--<template>-->
<!--    <div class="p-field">-->
<!--        <label v-if="label" :for="id">{{ label }}</label>-->
<!--        <InputText-->
<!--            :id="id"-->
<!--            :value="data.value"-->
<!--            @input="onChange($event.target.value)"-->
<!--            :placeholder="description"-->
<!--        />-->
<!--        <small v-if="!isValid" class="p-error">{{ errorMessage }}</small>-->
<!--    </div>-->
<!--</template>-->

<!--<script lang="ts">-->
<!--import { computed } from 'vue';-->
<!--import InputText from 'primevue/inputtext';-->
<!--import { useJsonFormsControl } from '@jsonforms/vue';-->

<!--export default {-->
<!--    name: 'StringControlRenderer',-->
<!--    components: {-->
<!--        InputText,-->
<!--    },-->
<!--    props: ['uischema', 'schema', 'path', 'enabled', 'id', 'visible'],-->
<!--    setup(props) {-->
<!--        const {-->
<!--            data,-->
<!--            handleChange,-->
<!--            errors,-->
<!--            label,-->
<!--            description,-->
<!--            required,-->
<!--        } = useJsonFormsControl(props);-->

<!--        const isValid = computed(() => errors.value.length === 0);-->
<!--        const errorMessage = computed(() => errors.value.join('\n'));-->

<!--        const onChange = (value) => {-->
<!--            handleChange(props.path, value);-->
<!--        };-->

<!--        return {-->
<!--            data,-->
<!--            handleChange,-->
<!--            errors,-->
<!--            label,-->
<!--            description,-->
<!--            required,-->
<!--            isValid,-->
<!--            errorMessage,-->
<!--            onChange,-->
<!--        };-->
<!--    },-->
<!--};-->
<!--</script>-->
