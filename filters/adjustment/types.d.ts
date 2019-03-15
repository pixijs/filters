/// <reference types="pixi.js" />
declare module "@pixi/filter-adjustment" {
    export class AdjustmentFilter extends PIXI.Filter {
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
    export interface AdjustmentOptions {
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
