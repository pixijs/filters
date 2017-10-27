/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class DropShadowFilter extends PIXI.Filter<{}> {
        constructor(rotation?:number, distance?:number, blur?:number, color?:number, alpha?:number);
        alpha:number;
        blur:number;
        color:number;
        distance:number;
        rotation:number;
    }
}

declare module "@pixi/filter-drop-shadow" {
    export = PIXI.filters;
}