/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class BevelFilter extends PIXI.Filter<{}> {
        constructor(options?:BevelOptions);
        rotation:number;
        thickness:number;
        lightColor:number;
        lightAlpha:number;
        shadowColor:number;
        shadowAlpha:number;
    }
    interface BevelOptions {
        rotation:number;
        thickness:number;
        lightColor:number;
        lightAlpha:number;
        shadowColor:number;
        shadowAlpha:number;
    }
}

declare module "@pixi/filter-bevel" {
    export = PIXI.filters;
}
