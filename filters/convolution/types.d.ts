/// <reference types="pixi.js" />
declare module "@pixi/filter-convolution" {
    export class ConvolutionFilter extends PIXI.Filter {
        constructor(matrix:number[], width:number, height:number);
        height:number;
        width:number;
        matrix:number[];
    }
}
