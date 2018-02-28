/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class KawaseBlurFilter extends PIXI.Filter<{}> {
        constructor(blur?:number|number[], quality?:number, clamp?:boolean);
        kernels:number[];
        pixelSize:number|PIXI.Point|number[];
        quality:number;
        blur:number;
        readonly clamp:boolean;
    }
}

declare module "@pixi/filter-kawase-blur" {
    export = PIXI.filters;
}
