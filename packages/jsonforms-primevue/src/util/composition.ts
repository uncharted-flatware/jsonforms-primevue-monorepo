import { computed, ComputedRef, ref } from 'vue';
import { cloneDeep, merge } from 'lodash';
import { UISchemaElement } from "@jsonforms/core";

/**
 * Adds isFocused, appliedOptions and onChange (TODO: styles)
 */
export const useControlCommon = <
    I extends { control: any; handleChange: any }
>(
    input: I,
    adaptTarget: (target: any) => any = (v) => v
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.control.value.config),
            cloneDeep(input.control.value.uischema.options)
        )
    );

    const isFocused = ref(false);
    const onChange = (value: any) => {
        input.handleChange(input.control.value.path, adaptTarget(value));
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

/**
 * Adds appliedOptions (TODO: styles)
 */
export const useLayoutCommon = <
    T extends { config: any; uischema: UISchemaElement },
    I extends { layout: ComputedRef<T> },
>(
    input: I,
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.layout.value.config),
            cloneDeep(input.layout.value.uischema.options)
        )
    );

    return {
        ...input,
        appliedOptions
    };
};

export const useLabelCommon = <
    T extends { config: any; uischema: UISchemaElement },
    I extends { label: ComputedRef<T> },
>(
    input: I,
) => {
    const appliedOptions = computed(() =>
        merge(
            {},
            cloneDeep(input.label.value.config),
            cloneDeep(input.label.value.uischema.options)
        )
    );

    return {
        ...input,
        appliedOptions
    };
};

