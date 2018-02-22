/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class BevelFilter extends PIXI.Filter<{}> {
        constructor(rotation?:number, thickness?:number, lightColor?:number, lightAlpha?:number, shadowColor?:number, shadowAlpha?:number);
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