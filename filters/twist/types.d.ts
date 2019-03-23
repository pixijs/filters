/// <reference types="pixi.js" />
declare module "@pixi/filter-twist" {
    export class TwistFilter extends PIXI.Filter {
        constructor(radius?:number, angle?:number, padding?:number);
        angle:number;
        offset:PIXI.Point;
        radius:number;
    }
}
