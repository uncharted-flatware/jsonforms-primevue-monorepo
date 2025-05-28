export interface Options {
    showUnfocusedDescription?: boolean;
    hideRequiredAsterisk?: boolean;
    focus?: boolean;
    
    // Display mode options
    displayOnly?: boolean;
    compact?: boolean;

    // Relevant to most controls
    labelPlacement?: 'left' | 'right' | 'float' | 'hide' | 'top';
    
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

    // Chart/Visualization controls
    encoding?: {
        x?: { field: string; type: 'temporal' | 'quantitative' | 'nominal' | 'ordinal'; title?: string };
        y?: { field: string; type: 'temporal' | 'quantitative' | 'nominal' | 'ordinal'; title?: string };
        y2?: { field: string; type: 'temporal' | 'quantitative' | 'nominal' | 'ordinal'; title?: string };
        color?: { field: string; type: 'temporal' | 'quantitative' | 'nominal' | 'ordinal'; title?: string };
        size?: { field: string; type: 'temporal' | 'quantitative' | 'nominal' | 'ordinal'; title?: string };
        yError?: { field: string; type: 'quantitative'; title?: string };
        yError2?: { field: string; type: 'quantitative'; title?: string };
        xError?: { field: string; type: 'quantitative'; title?: string };
        xError2?: { field: string; type: 'quantitative'; title?: string };
    };
    
    // Chart configuration options (non-styling)
    title?: string;
    width?: number;
    height?: number;
    showAsErrorBand?: boolean;
}
