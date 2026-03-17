export type SelectionMode = 'bounding-box' | 'column' | 'row';

export interface SelectionRect {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

export interface SelectionBounds {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface SelectionOverlayStyle {
    fill?: string;
    fillOpacity?: number;
    stroke?: string;
    strokeWidth?: number;
}

export interface SelectionConfig {
    enabled?: boolean;
    mode?: SelectionMode;
    overlayStyle?: SelectionOverlayStyle;
}
