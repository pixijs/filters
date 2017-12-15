/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class RadialBlurFilter extends PIXI.Filter<{}> {
        constructor(angle?:number, kernelSize?:number);
        angle:number;
        kernelSize:number;
    }
}

declare module "@pixi/filter-radial-blur" {
    export = PIXI.filters;
}
