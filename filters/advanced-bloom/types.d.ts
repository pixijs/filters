/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AdvancedBloomFilter extends PIXI.Filter {
        constructor(options?: AdvancedBloomOptions);
        constructor(minBright?: number);
        minBright: number;
        brightScale: number;
        toneScale: number;
        blur: number;
    }
    interface AdvancedBloomOptions {
        minBright?: number;
        brightScale?: number;
        toneScale?: number;
        blur?: number;
        quality?: number;
        resolution?: number;
        kernelSize?: number;
    }
}

declare module "@pixi/filter-advanced-bloom" {
    export = PIXI.filters;
}