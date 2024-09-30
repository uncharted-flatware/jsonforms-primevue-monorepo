export interface Options {
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    focus?: boolean;

    // Relevant to most controls
    labelPlacement?: 'left' | 'right' | 'above' | 'below' | 'float';

    // Relevant to number controls
    step?: number;
    prefix?: string;
    suffix?: string;

    // Date/Time controls
    hourFormat?: string;
}
