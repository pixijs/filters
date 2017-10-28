/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class SimpleLightmapFilter extends PIXI.Filter<{}> {
        constructor(texture:PIXI.Texture, color?:number[]|number);
        alpha:number;
        color:number[]|number;
        texture:PIXI.Texture;
    }
}

declare module "@pixi/filter-simple-lightmap" {
    export = PIXI.filters;
}