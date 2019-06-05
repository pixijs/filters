/// <reference types="pixi.js" />
declare module "@pixi/filter-color-overlay" {
    export class ColorOverlayFilter extends PIXI.Filter {
        constructor(originalColor?:number|number[], newColor?:number|number[], epsilon?:number);
        epsilon:number;
        originalColor:number|number[];
        newColor:number|number[];
    }
}
