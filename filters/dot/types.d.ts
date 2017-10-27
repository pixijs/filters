/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class DotFilter extends PIXI.Filter<{}> {
        constructor(scale?:number, angle?:number);
        angle:number;
        scale:number;
    }
}

declare module "@pixi/filter-dot" {
    export = PIXI.filters;
}