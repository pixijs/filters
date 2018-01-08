/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AdjustmentFilter extends PIXI.Filter<{}> {
        constructor(options?: AdjustmentOptions);
        gamma: number;
        contrast: number;
        saturation: number;
        brightness: number;
        red: number;
        green: number;
        blue: number;
        alpha: number;
    }
    interface AdjustmentOptions {
        gamma?: number;
        contrast?: number;
        saturation?: number;
        brightness?: number;
        red?: number;
        green?: number;
        blue?: number;
        alpha?: number;
    }
}

declare module "@pixi/filter-adjustment" {
    export = PIXI.filters;
}
