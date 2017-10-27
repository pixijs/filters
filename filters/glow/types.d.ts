/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GlowFilter extends PIXI.Filter<{}> {
        constructor(distance?:number, outerStrength?:number, innerStrength?:number, color?:number, quality?:number);
        color:number;
        distance:number;
        innerStrength:number;
        outerStrength:number;
    }
}

declare module "@pixi/filter-glow" {
    export = PIXI.filters;
}