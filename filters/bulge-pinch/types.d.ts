/// <reference types="pixi.js" />
declare module "@pixi/filter-bulge-pinch" {
    export class BulgePinchFilter extends PIXI.Filter {
        constructor(center?:PIXI.Point|number[], radius?:number, strength?:number);
        center:PIXI.Point;
        radius:number;
        strength:number;
    }
}
