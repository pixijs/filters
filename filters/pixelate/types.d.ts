/// <reference types="pixi.js" />
declare module "@pixi/filter-pixelate" {
    export class PixelateFilter extends PIXI.Filter {
        constructor(size?:PIXI.Point|number[]|number);
        size:PIXI.Point|number[]|number;
    }
}