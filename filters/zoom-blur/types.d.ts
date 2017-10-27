/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ZoomBlurFilter extends PIXI.Filter<{}> {
        constructor(strength?:number, center?:PIXI.Point|number[], innerRadius?:number, radius?:number);
        strength:number;
        center:PIXI.Point|number[];
        innerRadius:number;
        radius:number;
    }
}

declare module "@pixi/filter-zoom-blur" {
    export = PIXI.filters;
}