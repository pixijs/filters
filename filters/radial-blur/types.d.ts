/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class RadialBlurFilter extends PIXI.Filter<{}> {
        constructor(angle?:number, center?:number[]|PIXI.Point, kernelSize?:number, radius?:number);
        angle:number;
        center:number[]|PIXI.Point;
        kernelSize:number;
        radius:number;
    }
}

declare module "@pixi/filter-radial-blur" {
    export = PIXI.filters;
}
