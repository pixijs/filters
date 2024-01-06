import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import fragment from './dot.frag';
import source from './dot.wgsl';
import { vertex, wgslVertex } from '@tools/fragments';

// @author Mat Groves http://matgroves.com/ @Doormat23
// original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js

/**
 * This WebGPU filter has been ported from the WebGL renderer that was originally created by Mat Groves (@GoodBoyDigital)
 * Original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

export interface DotFilterOptions
{
    /**
     * The scale of the effect
     * @default 1
     */
    scale?: number;
    /**
     * The angle of the effect
     * @default 5
     */
    angle?: number;
    /**
     * Whether to rendering it in gray scale
     * @default true
     */
    grayscale?: boolean;
}

/**
 * This filter applies a dotscreen effect making display objects appear to be made out of
 * black and white halftone dots like an old printer.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/dot.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-dot|@pixi/filter-dot}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class DotFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: DotFilterOptions = {
        scale: 1,
        angle: 5,
        grayscale: true
    };

    constructor(options?: DotFilterOptions)
    {
        options = { ...DotFilter.DEFAULT_OPTIONS, ...options };

        const dotUniforms = {
            uScale: { value: options.scale, type: 'f32' },
            uAngle: { value: options.angle, type: 'f32' },
            uGrayScale: { value: options.grayscale ? 1 : 0, type: 'f32' },
        };

        const gpuProgram = new GpuProgram({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'dot-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                dotUniforms,
            },
        });
    }

    /**
     * The scale of the effect.
     * @default 1
     */
    get scale(): number { return this.resources.dotUniforms.uniforms.uScale; }
    set scale(value: number) { this.resources.dotUniforms.uniforms.uScale = value; }

    /**
    * The radius of the effect.
    * @default 5
    */
    get angle(): number { return this.resources.dotUniforms.uniforms.uAngle; }
    set angle(value: number) { this.resources.dotUniforms.uniforms.uAngle = value; }

    /**
    * Whether to rendering it in gray scale.
    * @default true
    */
    get grayscale(): boolean { return this.resources.dotUniforms.uniforms.uGrayScale === 1; }
    set grayscale(value: boolean) { this.resources.dotUniforms.uniforms.uGrayScale = value ? 1 : 0; }
}
