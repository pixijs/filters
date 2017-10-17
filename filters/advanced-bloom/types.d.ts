/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AdvancedBloomFilter extends PIXI.Filter {
        constructor(options?: AdvancedBloomOptions);
        constructor(threshold?: number);
        threshold: number;
        brightness: number;
        contrast: number;
        blur: number;
    }
    interface AdvancedBloomOptions {
        threshold?: number;
        brightness?: number;
        contrast?: number;
        blur?: number;
        quality?: number;
        resolution?: number;
        kernelSize?: number;
    }
}

declare module "@pixi/filter-advanced-bloom" {
    export = PIXI.filters;
}