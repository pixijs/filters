/// <reference types="pixi.js" />
declare module "@pixi/filter-reflection" {
    export class ReflectionFilter extends PIXI.Filter {
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