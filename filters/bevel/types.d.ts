/// <reference types="pixi.js" />
declare module "@pixi/filter-bevel" {
    export class BevelFilter extends PIXI.Filter {
        constructor(options?:BevelOptions);
        rotation:number;
        thickness:number;
        lightColor:number;
        lightAlpha:number;
        shadowColor:number;
        shadowAlpha:number;
    }
    export interface BevelOptions {
        rotation:number;
        thickness:number;
        lightColor:number;
        lightAlpha:number;
        shadowColor:number;
        shadowAlpha:number;
    }
}
