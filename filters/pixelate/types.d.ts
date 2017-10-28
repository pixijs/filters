/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class PixelateFilter extends PIXI.Filter<{}> {
        constructor(size?:PIXI.Point|number[]|number);
        size:PIXI.Point|number[]|number;
    }
}

declare module "@pixi/filter-pixelate" {
    export = PIXI.filters;
}