/// <reference types="pixi.js" />
declare module "@pixi/filter-ascii" {
    export class AsciiFilter extends PIXI.Filter {
        constructor(size?:number);
        size:number;
    }
}
