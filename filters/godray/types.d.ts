/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GodrayFilter extends PIXI.Filter<{}> {
        constructor(options?:GodrayFilterOptions);
        angle:number;
        center:PIXI.Point|Array<number>;
        parallel:boolean;
        gain:number;
        lacunarity:number;
        time:number;
    }
    interface GodrayFilterOptions {
        angle:number;
        center:PIXI.Point|Array<number>;
        parallel:boolean;
        gain:number;
        lacunarity:number;
        time:number;
    }
}

declare module "@pixi/filter-godray" {
    export = PIXI.filters;
}