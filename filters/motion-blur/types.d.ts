/// <reference types="pixi.js" />
declare module "@pixi/filter-motion-blur" {
    export class MotionBlurFilter extends PIXI.Filter {
        constructor(velocity:PIXI.ObservablePoint|PIXI.Point|number[], kernelSize?:number, offset?:number);
        velocity:PIXI.ObservablePoint;
        kernelSize:number;
        offset:number;
    }
}
