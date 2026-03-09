import { Point } from '../shared/interfaces';

export interface WatershedPolygon {
    id: number;
    label: { id: string };
    points: Point[];
}

export type Marker = {
    id: number;
    label: { id: string };
    points: Point[];
};
