/// <reference types="pixi.js" />

declare namespace PIXI.filters {
    export interface TwistFilterOptions {
        angle?: number;
        offset?: PIXI.Point;
        padding?: number;
        radius?: number;
    }
    export class TwistFilter extends PIXI.Filter {
        /**
         * @deprecated Use options instead.
         */
        constructor(radius:number, angle?:number, padding?:number);
        constructor(options?:TwistFilterOptions);
        angle:number;
        offset:PIXI.Point;
        radius:number;
    }
}

declare module "@pixi/filter-twist" {
    export import TwistFilter = PIXI.filters.TwistFilter;
}
