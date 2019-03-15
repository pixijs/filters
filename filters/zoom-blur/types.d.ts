/// <reference types="pixi.js" />
declare module "@pixi/filter-zoom-blur" {
    export class ZoomBlurFilter extends PIXI.Filter {
        constructor(strength?:number, center?:PIXI.Point|number[], innerRadius?:number, radius?:number);
        strength:number;
        center:PIXI.Point|number[];
        innerRadius:number;
        radius:number;
    }
}
