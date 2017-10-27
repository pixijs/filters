/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class TiltShiftFilter extends PIXI.Filter<{}> {
        constructor(blur?:number, gradientBlur?:number, start?:PIXI.Point, end?:PIXI.Point);
        blur:number;
        end:PIXI.Point;
        gradientBlur:number;
        start:PIXI.Point;
    }
}

declare module "@pixi/filter-tilt-shift" {
    export = PIXI.filters;
}