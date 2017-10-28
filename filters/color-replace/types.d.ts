/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ColorReplaceFilter extends PIXI.Filter<{}> {
        constructor(originalColor?:number|number[], newColor?:number|number[], epsilon?:number);
        epsilon:number;
        originalColor:number|number[];
        newColor:number|number[];
    }
}

declare module "@pixi/filter-color-replace" {
    export = PIXI.filters;
}