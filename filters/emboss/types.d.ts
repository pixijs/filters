/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class EmbossFilter extends PIXI.Filter<{}> {
        constructor(strength?:number);
        strength:number;
    }
}

declare module "@pixi/filter-emboss" {
    export = PIXI.filters;
}