/// <reference types="pixi.js" />
declare module "@pixi/filter-color-replace" {
    export class ColorReplaceFilter extends PIXI.Filter {
        constructor(originalColor?:number|number[], newColor?:number|number[], epsilon?:number);
        epsilon:number;
        originalColor:number|number[];
        newColor:number|number[];
    }
}
