/// <reference types="pixi.js" />
declare module "@pixi/filter-emboss" {
    export class EmbossFilter extends PIXI.Filter {
        constructor(strength?:number);
        strength:number;
    }
}
