/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class RGBSplitFilter extends PIXI.Filter<{}> {
        constructor(red?:PIXI.Point, green?:PIXI.Point, blue?:PIXI.Point);
        red:PIXI.Point;
        green:PIXI.Point;
        blue:PIXI.Point;
    }
}

declare module "@pixi/filter-rgb-split" {
    export = PIXI.filters;
}