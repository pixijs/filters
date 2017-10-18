/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class MultiColorReplaceFilter extends PIXI.Filter {
        constructor(replacements:Array[], epsilon?:number, maxColorCount?:number);
        replacements:Array[];
        epsilon:number;
        maxColorCount:number;
    }
}

declare module "@pixi/filter-multi-color-replace" {
    export = PIXI.filters;
}