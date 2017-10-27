/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class MultiColorReplaceFilter extends PIXI.Filter<{}> {
        constructor(replacements:Array<number[]|number[][]>, epsilon?:number, maxColors?:number);
        replacements:Array<number[]|number[][]>;
        epsilon:number;
        readonly maxColors:number;
        refresh():void;
    }
}

declare module "@pixi/filter-multi-color-replace" {
    export = PIXI.filters;
}