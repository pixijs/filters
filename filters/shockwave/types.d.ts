/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ShockwaveFilter extends PIXI.Filter<{}> {
        constructor(center?:PIXI.Point|number[], options?:ShockwaveOptions, time?:number);
        center: PIXI.Point|number[];
        options: ShockwaveOptions;
        time: number;
    }
    interface ShockwaveOptions {
        amplitude?: number;
        wavelength?: number;
        brightness?: number;
        speed?: number;
        radius?: number;
    }
}

declare module "@pixi/filter-shockwave" {
    export = PIXI.filters;
}