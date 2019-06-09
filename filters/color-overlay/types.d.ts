/// <reference types="pixi.js" />
declare module "@pixi/filter-color-overlay" {
    export class ColorOverlayFilter extends PIXI.Filter {
        constructor(color?:number|[number, number, number]);
        color:number|[number, number, number];
    }
}
