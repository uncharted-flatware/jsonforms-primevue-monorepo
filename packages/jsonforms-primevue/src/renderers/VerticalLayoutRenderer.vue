<template>
    <div class="p-fluid">
        <RendererComponent
            v-for="(child, index) in uischema.elements"
            :key="index"
            :uischema="child"
            :schema="schema"
            :path="path"
        />
    </div>
</template>

<script lang="ts">
import { RendererComponent } from '@jsonforms/vue';

export default {
    name: 'VerticalLayoutRenderer',
    components: {
        RendererComponent,
    },
    props: ['uischema', 'schema', 'path', 'enabled', 'visible'],
};
</script>
