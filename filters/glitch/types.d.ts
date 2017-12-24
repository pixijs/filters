/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GlitchFilter extends PIXI.Filter<{}> {
        constructor(options?:GlitchOptions);
        slices:number,
        offset:number,
        direction:number,
        fillMode:number,
        seed:number,
        red:PIXI.Point,
        green:PIXI.Point,
        blue:PIXI.Point
    }
    interface GlitchOptions {
        slices:number,
        offset:number,
        direction:number,
        fillMode:number,
        average:boolean,
        seed:number,
        red:PIXI.Point,
        green:PIXI.Point,
        blue:PIXI.Point,
        minSliceWidth:number,
        displacementMapSize:number,
        displacementMap:PIXI.Texture,
    }
}

declare module "@pixi/filter-glitch" {
    export = PIXI.filters;
}
