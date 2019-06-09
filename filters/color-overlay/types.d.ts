/// <reference types="pixi.js" />
declare module "@pixi/filter-color-overlay" {
    export class ColorOverlayFilter extends PIXI.Filter {
        constructor(color?:number|[number, number, number]);
        epsilon:number;
        originalColor:number|number[];
        newColor:number|number[];
    }
}
