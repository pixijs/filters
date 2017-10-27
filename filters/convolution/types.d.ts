/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class ConvolutionFilter extends PIXI.Filter<{}> {
        constructor(matrix:number[], width:number, height:number);
        height:number;
        width:number;
        matrix:number[];
    }
}

declare module "@pixi/filter-convolution" {
    export = PIXI.filters;
}