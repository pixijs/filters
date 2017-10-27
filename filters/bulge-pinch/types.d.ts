/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class BulgePinchFilter extends PIXI.Filter<{}> {
        constructor(center?:PIXI.Point|number[], radius?:number, strength?:number);
        center:PIXI.Point;
        radius:number;
        strength:number;
    }
}

declare module "@pixi/filter-bulge-pinch" {
    export = PIXI.filters;
}