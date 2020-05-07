/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    export class GodrayFilter extends PIXI.Filter {
<<<<<<< HEAD
        constructor(options?:GodrayFilterOptions);
        angle:number;
        center:PIXI.Point|Array<number>;
        parallel:boolean;
        gain:number;
        lacunarity:number;
        time:number;
        alpha:number;
    }
    export interface GodrayFilterOptions {
        angle:number;
        center:PIXI.Point|Array<number>;
        parallel:boolean;
        gain:number;
        lacunarity:number;
        time:number;
        alpha:number;
=======
        constructor(options?: GodrayFilterOptions);
        angle: number;
        center: PIXI.Point | Array<number>;
        parallel: boolean;
        gain: number;
        lacunarity: number;
        time: number;
        alpha: number;
    }
    export interface GodrayFilterOptions {
        angle: number;
        center: PIXI.Point | Array<number>;
        parallel: boolean;
        gain: number;
        lacunarity: number;
        time: number;
        alpha: number;
>>>>>>> 550fd2bc1d343dcc6789cd3a62c51602b614368f
    }
}

declare module "@pixi/filter-godray" {
    export import GodrayFilter = PIXI.filters.GodrayFilter;
    export import GodrayFilterOptions = PIXI.filters.GodrayFilterOptions;
}
