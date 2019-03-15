/// <reference types="pixi.js" />
declare module "@pixi/filter-shockwave" {
    export class ShockwaveFilter extends PIXI.Filter {
        constructor(center?:PIXI.Point|number[], options?:ShockwaveOptions, time?:number);
        center: PIXI.Point|number[];
        options: ShockwaveOptions;
        time: number;
    }
    export interface ShockwaveOptions {
        amplitude?: number;
        wavelength?: number;
        brightness?: number;
        speed?: number;
        radius?: number;
    }
}
