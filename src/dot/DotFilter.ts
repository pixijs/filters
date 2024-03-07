import { deprecation, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './dot.frag';
import source from './dot.wgsl';

/** Options for the DotFilter constructor. */
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
 * ![original](../screenshots/original.png)![filter](../screenshots/dot.png)
 *
 * {@link https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js Original filter}
 *
 * @class
 * @extends Filter
 */
export class DotFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: DotFilterOptions = {
        scale: 1,
        angle: 5,
        grayscale: true
    };

    /**
     * @param options - Options for the DotFilter constructor.
     */
    constructor(options?: DotFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number} [scale=1] - The scale of the effect.
     * @param {number} [angle=5] - The radius of the effect.
     * @param {boolean} [grayscale=true] - Render as grayscale.
     */
    constructor(scale?: number, angle?: number, grayscale?: boolean);
    /** @ignore */
    constructor(...args: [DotFilterOptions?] | [number?, number?, boolean?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number')
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'DotFilter constructor params are now options object. See params: { scale, angle, grayscale }');

            options = { scale: options };

            if (args[1] !== undefined) options.angle = args[1];
            if (args[2] !== undefined) options.grayscale = args[2];
        }

        options = { ...DotFilter.DEFAULT_OPTIONS, ...options };

        const dotUniforms = {
            uScale: { value: options.scale, type: 'f32' },
            uAngle: { value: options.angle, type: 'f32' },
            uGrayScale: { value: options.grayscale ? 1 : 0, type: 'f32' },
        };

        const gpuProgram = GpuProgram.from({
            vertex: {
                source: wgslVertex,
                entryPoint: 'mainVertex',
            },
            fragment: {
                source,
                entryPoint: 'mainFragment',
            },
        });

        const glProgram = GlProgram.from({
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
