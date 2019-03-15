/// <reference types="pixi.js" />
declare module "@pixi/filter-crt" {
    export class CRTFilter extends PIXI.Filter {
        constructor(options?: CRTOptions);
        curvature: number;
        lineWidth: number;
        lineContrast: number;
        verticalLine: number;
        noise: number;
        noiseSize: number;
        seed: number;
        vignetting: number;
        vignettingAlpha: number;
        vignettingBlur: number;
        time: number;
    }
    export interface CRTOptions {
        curvature?: number;
        lineWidth?: number;
        lineContrast?: number;
        verticalLine?: number;
        noise?: number;
        noiseSize?: number;
        seed?: number;
        vignetting?: number;
        vignettingAlpha?: number;
        vignettingBlur?: number;
        time?: number;
    }
}
