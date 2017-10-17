/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class MultiColorReplaceFilter extends PIXI.Filter {
        constructor(colorPairs:Array[], epsilon?:number);
        colorPairs:Array[];
        epsilon:number;
    }
}

declare module "@pixi/filter-multi-color-replace" {
    export = PIXI.filters;
}