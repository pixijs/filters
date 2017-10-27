/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AsciiFilter extends PIXI.Filter<{}> {
        constructor(size?:number);
        size:number;
    }
}

declare module "@pixi/filter-ascii" {
    export = PIXI.filters;
}