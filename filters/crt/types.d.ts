/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class CRTFilter extends PIXI.Filter<{}> {
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
    interface CRTOptions {
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

declare module "@pixi/filter-crt" {
    export = PIXI.filters;
}
