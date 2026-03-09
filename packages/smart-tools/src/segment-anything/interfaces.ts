import { Shape } from '../shared/interfaces';

export interface SegmentAnythingResult {
    shapes: Shape[];
    areas: number[];
    maxContourIdx: number;
}
