/// <reference types="pixi.js" />
declare module "@pixi/filter-zoom-blur" {
    export interface ZoomBlurFilterOptions {
        strength:number;
        center:PIXI.Point|[number, number];
        innerRadius:number;
        radius:number;
    }
    export class ZoomBlurFilter extends PIXI.Filter {
        constructor(options?:ZoomBlurFilterOptions);
        constructor(strength?:number, center?:PIXI.Point|[number, number], innerRadius?:number, radius?:number);
        strength:number;
        center:PIXI.Point|[number, number];
        innerRadius:number;
        radius:number;
    }
}
