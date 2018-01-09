/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ReflectionFilter extends PIXI.Filter<{}> {
        constructor(options?: ReflectionOptions);
        mirror: boolean;
        boundary: number;
        amplitude: number[];
        waveLength: number[];
        alpha: number[];
        time: number;
    }
    interface ReflectionOptions {
        mirror?: boolean;
        boundary?: number;
        amplitude?: number[];
        waveLength?: number[];
        alpha?: number[];
        time?: number;
    }
}

declare module "@pixi/filter-reflection" {
    export = PIXI.filters;
}
