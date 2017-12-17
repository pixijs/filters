/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class MotionBlurFilter extends PIXI.Filter<{}> {
        constructor(velocity:PIXI.Point|number[], kernelSize?:number, offset?:number);
        velocity:PIXI.Point|number[];
        kernelSize:number;
        offset:number;
    }
}

declare module "@pixi/filter-motion-blur" {
    export = PIXI.filters;
}
