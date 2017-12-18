/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class KawaseBlurFilter extends PIXI.Filter<{}> {
        constructor(kernels:number[], pixelSize?:number|PIXI.Point|number[]);
        kernels:number[];
        pixelSize:number|PIXI.Point|number[];
    }
}

declare module "@pixi/filter-kawase-blur" {
    export = PIXI.filters;
}
