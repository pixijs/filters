/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class GlitchFilter extends PIXI.Filter<{}> {
        constructor(options?:GlitchOptions);
        slices:number;
        offset:number;
        direction:number;
        fillMode:number;
        seed:number;
        red:PIXI.Point;
        green:PIXI.Point;
        blue:PIXI.Point;
        sizes:Float32Array|number[];
        offsets:Float32Array|number[];
        refresh(): void;
        shuffle(): void;
        redraw(): void;
        readonly texture:PIXI.Texture;
    }
    interface GlitchOptions {
        slices:number;
        offset:number;
        direction:number;
        fillMode:number;
        average:boolean;
        seed:number;
        red:PIXI.Point;
        green:PIXI.Point;
        blue:PIXI.Point;
        minSize:number;
        sampleSize:number;
    }
}

declare module "@pixi/filter-glitch" {
    export = PIXI.filters;
}
