/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    export class GodrayFilter extends PIXI.Filter {
        constructor(options?:GodrayFilterOptions);
        angle:number;
        center:PIXI.Point|Array<number>;
        parallel:boolean;
        gain:number;
        lacunarity:number;
        time:number;
    }
    export interface GodrayFilterOptions {
        angle:number;
        center:PIXI.Point|Array<number>;
        parallel:boolean;
        gain:number;
        lacunarity:number;
        time:number;
    }
}

declare module "@pixi/filter-godray" {
    export import GodrayFilter = PIXI.filters.GodrayFilter;
    export import GodrayFilterOptions = PIXI.filters.GodrayFilterOptions;
}
