/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AdvancedBloomFilter extends PIXI.Filter<{}> {
        constructor(options?: AdvancedBloomOptions);
        constructor(threshold?: number);
        threshold: number;
        bloomScale: number;
        brightness: number;
        kernels: number[];
        blur: number;
        quality: number;
        pixelSize:number|PIXI.Point|number[];
        resolution: number;
    }
    interface AdvancedBloomOptions {
        threshold?: number;
        bloomScale?: number;
        brightness?: number;
        kernels?: number[];
        blur?: number;
        quality?: number;
        pixelSize?: number|PIXI.Point|number[];
        resolution?: number;
    }
}

declare module "@pixi/filter-advanced-bloom" {
    export = PIXI.filters;
}