/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class OldFilmFilter extends PIXI.Filter<{}> {
        constructor(options?: OldFilmOptions, seed?: number);
        constructor(seed?: number);
        sepia: number;
        noise: number;
        noiseSize: number;
        scratch: number;
        scratchDensity: number;
        scratchWidth: number;
        vignetting: number;
        vignettingAlpha: number;
        vignettingBlur: number;
        seed: number;
    }
    interface OldFilmOptions {
        sepia?: number;
        noise?: number;
        noiseSize?: number;
        scratch?: number;
        scratchDensity?: number;
        scratchWidth?: number;
        vignetting?: number;
        vignettingAlpha?: number;
        vignettingBlur?: number;
    }
}

declare module "@pixi/filter-old-film" {
    export = PIXI.filters;
}
