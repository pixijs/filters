/// <reference types="pixi.js" />
declare module "@pixi/filter-outline" {
    export class OutlineFilter extends PIXI.Filter {
        constructor(thickness?:number, color?:number, quality?:number);
        color:number;
        thickness:number;
        readonly quality:number;
    }
}
