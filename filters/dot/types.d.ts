/// <reference types="pixi.js" />
declare module "@pixi/filter-dot" {
    export class DotFilter extends PIXI.Filter {
        constructor(scale?:number, angle?:number);
        angle:number;
        scale:number;
    }
}