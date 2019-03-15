/// <reference types="pixi.js" />
declare module "@pixi/filter-radial-blur" {
    export class RadialBlurFilter extends PIXI.Filter {
        constructor(angle?:number, center?:number[]|PIXI.Point, kernelSize?:number, radius?:number);
        angle:number;
        center:number[]|PIXI.Point;
        kernelSize:number;
        radius:number;
    }
}