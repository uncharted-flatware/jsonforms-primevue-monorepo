import { computed, ref } from 'vue';
import { cloneDeep, merge } from 'lodash';

/**
 * Adds isFocused, appliedOptions and onChange (TODO: styles)
 */
export const useControlCommon = <
    I extends { control: any; handleChange: any }
>(
    input: I,
    adaptTarget: (target: any) => any = (v) => v.value
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.control.value.config),
            cloneDeep(input.control.value.uischema.options)
        )
    );

    const isFocused = ref(false);
    const onChange = (event: Event) => {
        input.handleChange(input.control.value.path, adaptTarget(event.target));
    };

    const controlWrapper = computed(() => {
        const { id, description, errors, label, visible, required } =
            input.control.value;
        return { id, description, errors, label, visible, required };
    });

    return {
        ...input,
        // styles: useStyles(input.control.value.uischema),
        isFocused,
        appliedOptions,
        controlWrapper,
        onChange,
    };
};
