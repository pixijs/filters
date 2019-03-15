/// <reference types="pixi.js" />
declare module "@pixi/filter-rgb-split" {
    export class RGBSplitFilter extends PIXI.Filter {
        constructor(red?:PIXI.Point, green?:PIXI.Point, blue?:PIXI.Point);
        red:PIXI.Point;
        green:PIXI.Point;
        blue:PIXI.Point;
    }
}
