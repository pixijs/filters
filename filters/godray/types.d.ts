/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GodrayFilter extends PIXI.Filter<{}> {
        constructor(angle?:number, gain?:number, lacunarity?:number, time?:number);
        angle:number;
        gain:number;
        lacunarity:number;
        time:number;
    }
}

declare module "@pixi/filter-godray" {
    export = PIXI.filters;
}