/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class OutlineFilter extends PIXI.Filter<{}> {
        constructor(thickness?:number, color?:number);
        color:number;
        thickness:number;
    }
}

declare module "@pixi/filter-outline" {
    export = PIXI.filters;
}