/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class MultiColorReplaceFilter extends PIXI.Filter {
        constructor(originalColors:number[]|Array[], newColors:number[]|Array[], epsilon?:number);
        originalColor:number[]|Array[];
        newColor:number[]|Array[];
        epsilon:number;
    }
}

declare module "@pixi/filter-multi-color-replace" {
    export = PIXI.filters;
}