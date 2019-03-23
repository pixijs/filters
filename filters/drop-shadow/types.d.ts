/// <reference types="pixi.js" />
declare module "@pixi/filter-drop-shadow" {
    export class DropShadowFilter extends PIXI.Filter {
        constructor(options?:DropShadowFilterOptions);
        alpha:number;
        blur:number;
        color:number;
        distance:number;
        kernels:number[];
        pixelSize:number|number[]|PIXI.Point;
        quality:number;
        resolution:number;
        rotation:number;
        shadowOnly:boolean;
    }
    export interface DropShadowFilterOptions {
        alpha?:number;
        blur?:number;
        color?:number;
        distance?:number;
        kernels?:number[];
        pixelSize?:number|number[]|PIXI.Point;
        quality?:number;
        resolution?:number;
        rotation?:number;
        shadowOnly?:boolean;
    }
}
