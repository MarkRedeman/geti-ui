import { Shape } from '../shared/interfaces';

export interface SegmentAnythingResult {
    shapes: Shape[];
    areas: number[];
    maxContourIdx: number;
    /** Raw low resolution prediction, to pass as `previousMask` when refining the same object */
    lowResMask?: Float32Array;
}
