/// <reference types="pixi.js" />
declare module "@pixi/filter-simple-lightmap" {
    export class SimpleLightmapFilter extends PIXI.Filter {
        constructor(texture:PIXI.Texture, color?:number[]|number);
        alpha:number;
        color:number[]|number;
        texture:PIXI.Texture;
    }
}
