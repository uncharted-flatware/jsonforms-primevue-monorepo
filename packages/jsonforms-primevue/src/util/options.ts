export interface Options {
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    focus?: boolean;
    
    // Display mode options
    displayOnly?: boolean;
    compact?: boolean;

    // Relevant to most controls
    labelPlacement?: 'left' | 'right' | 'float';
    
    // Description display options
    descriptionDisplay?: 'always' | 'tooltip';

    // Relevant to number controls
    step?: number;
    prefix?: string;
    suffix?: string;

    // Date/Time controls
    hourFormat?: string;

    // Array controls
    emptyMessage?: string;
}
