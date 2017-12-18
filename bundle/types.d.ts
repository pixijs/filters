/// <reference types="pixi.js" />
declare namespace PIXI.filters {
    class AsciiFilter extends PIXI.Filter<{}> {
        constructor(size?:number);
        size:number;
    }
    class AdvancedBloomFilter extends PIXI.Filter<{}> {
        constructor(options?: AdvancedBloomOptions);
        constructor(threshold?: number);
        threshold: number;
        bloomScale: number;
        brightness: number;
        blur: number;
    }
    interface AdvancedBloomOptions {
        threshold?: number;
        bloomScale?: number;
        brightness?: number;
        blur?: number;
        quality?: number;
        resolution?: number;
        kernelSize?: number;
    }
    class BloomFilter extends PIXI.Filter<{}> {
        constructor(blur?:number|PIXI.Point|number[], quality?:number, resolution?:number, kernelSize?:number);
        blur:number;
        blurX:number;
        blurY:number;
    }
    class BulgePinchFilter extends PIXI.Filter<{}> {
        constructor(center?:PIXI.Point|number[], radius?:number, strength?:number);
        center:PIXI.Point;
        radius:number;
        strength:number;
    }
    class ColorReplaceFilter extends PIXI.Filter<{}> {
        constructor(originalColor?:number|number[], newColor?:number|number[], epsilon?:number);
        epsilon:number;
        originalColor:number|number[];
        newColor:number|number[];
    }
    class ConvolutionFilter extends PIXI.Filter<{}> {
        constructor(matrix:number[], width:number, height:number);
        height:number;
        width:number;
        matrix:number[];
    }
    class CrossHatchFilter extends PIXI.Filter<{}> {
        constructor();
    }
    class DotFilter extends PIXI.Filter<{}> {
        constructor(scale?:number, angle?:number);
        angle:number;
        scale:number;
    }
    class DropShadowFilter extends PIXI.Filter<{}> {
        constructor(rotation?:number, distance?:number, blur?:number, color?:number, alpha?:number);
        alpha:number;
        blur:number;
        color:number;
        distance:number;
        rotation:number;
    }
    class EmbossFilter extends PIXI.Filter<{}> {
        constructor(strength?:number);
        strength:number;
    }
    class GlowFilter extends PIXI.Filter<{}> {
        constructor(distance?:number, outerStrength?:number, innerStrength?:number, color?:number, quality?:number);
        color:number;
        distance:number;
        innerStrength:number;
        outerStrength:number;
    }
    class GodrayFilter extends PIXI.Filter<{}> {
        constructor(angle?:number, gain?:number, lacunarity?:number, time?:number);
        angle:number;
        gain:number;
        lacunarity:number;
        time:number;
    }
    class KawaseBlurFilter extends PIXI.Filter<{}> {
        constructor(kernels:number[], pixelSize?:number|PIXI.Point|number[]);
        kernels:number[];
        pixelSize:number|PIXI.Point|number[];
    }
    class MotionBlurFilter extends PIXI.Filter<{}> {
        constructor(velocity:PIXI.Point|number[], kernelSize?:number, offset?:number);
        velocity:PIXI.Point|number[];
        kernelSize:number;
        offset:number;
    }
    class MultiColorReplaceFilter extends PIXI.Filter<{}> {
        constructor(replacements:Array<number[]|number[][]>, epsilon?:number, maxColors?:number);
        replacements:Array<number[]|number[][]>;
        epsilon:number;
        readonly maxColors:number;
        refresh():void;
    }
    class OldFilmFilter extends PIXI.Filter<{}> {
        constructor(options?: OldFilmOptions, seed?: number);
        constructor(seed?: number);
        sepia: number;
        noise: number;
        noiseSize: number;
        scratch: number;
        scratchDensity: number;
        scratchWidth: number;
        vignetting: number;
        vignettingAlpha: number;
        vignettingBlur: number;
        seed: number;
    }
    interface OldFilmOptions {
        sepia?: number;
        noise?: number;
        noiseSize?: number;
        scratch?: number;
        scratchDensity?: number;
        scratchWidth?: number;
        vignetting?: number;
        vignettingAlpha?: number;
        vignettingBlur?: number;
    }
    class OutlineFilter extends PIXI.Filter<{}> {
        constructor(thickness?:number, color?:number);
        color:number;
        thickness:number;
    }
    class PixelateFilter extends PIXI.Filter<{}> {
        constructor(size?:PIXI.Point|number[]|number);
        size:PIXI.Point|number[]|number;
    }
    class RadialBlurFilter extends PIXI.Filter<{}> {
        constructor(angle?:number, center?:number[]|PIXI.Point, kernelSize?:number, radius?:number);
        angle:number;
        center:number[]|PIXI.Point;
        kernelSize:number;
        radius:number;
    }
    class RGBSplitFilter extends PIXI.Filter<{}> {
        constructor(red?:PIXI.Point, green?:PIXI.Point, blue?:PIXI.Point);
        red:PIXI.Point;
        green:PIXI.Point;
        blue:PIXI.Point;
    }
    class ShockwaveFilter extends PIXI.Filter<{}> {
        constructor(center?:PIXI.Point|number[], options?:ShockwaveOptions, time?:number);
        center: PIXI.Point|number[];
        options: ShockwaveOptions;
        time: number;
    }
    interface ShockwaveOptions {
        amplitude?: number;
        wavelength?: number;
        brightness?: number;
        speed?: number;
        radius?: number;
    }
    class SimpleLightmapFilter extends PIXI.Filter<{}> {
        constructor(texture:PIXI.Texture, color?:number[]|number);
        alpha:number;
        color:number[]|number;
        texture:PIXI.Texture;
    }
    class TiltShiftFilter extends PIXI.Filter<{}> {
        constructor(blur?:number, gradientBlur?:number, start?:PIXI.Point, end?:PIXI.Point);
        blur:number;
        end:PIXI.Point;
        gradientBlur:number;
        start:PIXI.Point;
    }
    class TwistFilter extends PIXI.Filter<{}> {
        constructor(radius?:number, angle?:number, padding?:number);
        angle:number;
        offset:PIXI.Point;
        radius:number;
    }
    class ZoomBlurFilter extends PIXI.Filter<{}> {
        constructor(strength?:number, center?:PIXI.Point|number[], innerRadius?:number, radius?:number);
        strength:number;
        center:PIXI.Point|number[];
        innerRadius:number;
        radius:number;
    }
}

declare module "pixi-filters" {
    export = PIXI.filters;
}
