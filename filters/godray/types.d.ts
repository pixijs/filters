/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GodrayFilter extends PIXI.Filter<{}> {
        constructor(light?:number|PIXI.Point|Array<number>, gain?:number, lacunarity?:number, time?:number);
        light:number|PIXI.Point|Array<number>;
        gain:number;
        lacunarity:number;
        time:number;
    }
}

declare module "@pixi/filter-godray" {
    export = PIXI.filters;
}