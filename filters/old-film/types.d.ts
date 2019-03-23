/// <reference types="pixi.js" />
declare module "@pixi/filter-old-film" {
    export class OldFilmFilter extends PIXI.Filter {
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
    export interface OldFilmOptions {
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
