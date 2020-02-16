/// <reference types="pixi.js" />
declare module "@pixi/filter-bulge-pinch" {
    export interface BulgePinchFilterOptions {
        center:PIXI.Point|[number, number];
        radius:number;
        strength:number;
    }
    export class BulgePinchFilter extends PIXI.Filter {
        constructor(options?:BulgePinchFilterOptions);
        constructor(center?:PIXI.Point|[number, number], radius?:number, strength?:number);
        center:PIXI.Point;
        radius:number;
        strength:number;
    }
}
