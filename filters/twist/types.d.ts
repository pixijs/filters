/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class TwistFilter extends PIXI.Filter<{}> {
        constructor(radius?:number, angle?:number, padding?:number);
        angle:number;
        offset:PIXI.Point;
        radius:number;
    }
}

declare module "@pixi/filter-twist" {
    export = PIXI.filters;
}