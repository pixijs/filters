/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class OutlineFilter extends PIXI.Filter<{}> {
        constructor(thickness?:number, color?:number, quality?:number);
        color:number;
        thickness:number;
        quality:number;
    }
}

declare module "@pixi/filter-outline" {
    export = PIXI.filters;
}
