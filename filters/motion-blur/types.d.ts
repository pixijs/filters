/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class MotionBlurFilter extends PIXI.Filter<{}> {
        constructor(velocity:PIXI.Point|number[], kernelSize?:number);
        velocity:PIXI.Point|number[];
        kernelSize:number;
    }
}

declare module "@pixi/filter-motion-blur" {
    export = PIXI.filters;
}
