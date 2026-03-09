import { Rect, RegionOfInterest, Shape, ShapeType } from '../shared/interfaces';

export interface Match {
    value: number;
    x: number;
    y: number;
}

export interface SSIMMatch {
    shape: Rect;
    confidence: number;
}

export interface RunSSIMProps {
    imageData: ImageData;
    roi: RegionOfInterest;
    template: Rect;
    existingAnnotations: Shape[];
    autoMergeDuplicates: boolean;
    shapeType: ShapeType;
}
