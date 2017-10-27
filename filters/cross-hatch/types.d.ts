/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class CrossHatchFilter extends PIXI.Filter<{}> {
        constructor();
    }
}

declare module "@pixi/filter-cross-hatch" {
    export = PIXI.filters;
}