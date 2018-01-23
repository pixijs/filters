/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ColorAdjustFilter extends PIXI.Filter<{}> {
        constructor(colorMap?:HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture, nearest?:boolean);
        colorMap:PIXI.Texture;
        nearest:boolean;
        mix:number;
        readonly colorSize:number;
    }
}

declare module "@pixi/filter-color-adjust" {
    export = PIXI.filters;
}
