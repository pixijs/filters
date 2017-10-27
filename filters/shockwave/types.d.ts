/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ShockwaveFilter extends PIXI.Filter {
        constructor(center?:PIXI.Point, params?:number[], time?:number);
        center:PIXI.Point;
        params:number[];
        time:number;
    }
}

declare module "@pixi/filter-shockwave" {
    export = PIXI.filters;
}