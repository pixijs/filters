import { Color, ColorSource, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './glow.frag';
import source from './glow.wgsl';

/**
 * Options for the GlowFilter constructor.
 */
export interface GlowFilterOptions
{
    /**
     * The distance of the glow
     * @default 10
     */
    distance?: number;
    /**
     * The strength of the glow outward from the edge of the sprite
     * @default 4
     */
    outerStrength?: number;
    /**
     * The strength of the glow inward from the edge of the sprite
     * @default 0
     */
    innerStrength?: number;
    /**
     * The color of the glow
     * @default 0xffffff
     */
    color?: ColorSource;
    /**
     * The alpha of the glow
     * @default 1
     */
    alpha?: number;
    /**
     * A number between 0 and 1 that describes the quality of the glow. The higher the number the less performant
     * @default 0.1
     */
    quality?: number;
    /**
     * Toggle to hide the contents and only show glow
     * @default false
     */
    knockout?: boolean;
}

/**
 * GlowFilter, originally by mishaa
 * [codepen]{@link http://codepen.io/mishaa/pen/raKzrm}.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/glow.png)
 * @class
 *
 * @extends Filter
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter({ distance: 15, outerStrength: 2 })
 *  ];
 */
export class GlowFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: GlowFilterOptions = {
        distance: 10,
        outerStrength: 4,
        innerStrength: 0,
        color: 0xffffff,
        alpha: 1,
        quality: 0.1,
        knockout: false,
    };

    public uniforms: {
        uDistance: number;
        uStrength: Float32Array;
        uColor: Float32Array;
        uAlpha: number;
        uQuality: number;
        uKnockout: number;
    };

    private _color!: Color;

    /**
     * @param options - Options for the GlowFilter constructor.
     */
    constructor(options?: GlowFilterOptions)
    {
        options = { ...GlowFilter.DEFAULT_OPTIONS, ...options };

        const distance = options.distance ?? 10;
        const quality = options.quality ?? 0.1;

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

        // Altering uDistance and uQuality won't have any affect on WebGL
        // since we hard-assign them during creation to allow
        // for the values to be used in GLSL loops
        const glProgram = GlProgram.from({
            vertex,
            fragment: fragment
                .replace(/__ANGLE_STEP_SIZE__/gi, `${(1 / quality / distance).toFixed(7)}`)
                .replace(/__DIST__/gi, `${distance.toFixed(0)}.0`),
            name: 'glow-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                glowUniforms: {
                    uDistance: { value: distance, type: 'f32' },
                    uStrength: { value: [options.innerStrength, options.outerStrength], type: 'vec2<f32>' },
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                    uQuality: { value: quality, type: 'f32' },
                    uKnockout: { value: (options?.knockout ?? false) ? 1 : 0, type: 'f32' },
                }
            },
            padding: distance,
        });

        this.uniforms = this.resources.glowUniforms.uniforms;
        this._color = new Color();
        this.color = options.color ?? 0xffffff;
    }

    /**
     * Only draw the glow, not the texture itself
     * @default false
     */
    get distance(): number { return this.uniforms.uDistance; }
    set distance(value: number) { this.uniforms.uDistance = this.padding = value; }

    /**
    * The strength of the glow inward from the edge of the sprite.
    * @default 0
    */
    get innerStrength(): number { return this.uniforms.uStrength[0]; }
    set innerStrength(value: number) { this.uniforms.uStrength[0] = value; }

    /**
    * The strength of the glow outward from the edge of the sprite.
    * @default 4
    */
    get outerStrength(): number { return this.uniforms.uStrength[1]; }
    set outerStrength(value: number) { this.uniforms.uStrength[1] = value; }

    /**
    * The color of the glow.
    * @default 0xFFFFFF
    */
    get color(): ColorSource { return this._color.value as ColorSource; }
    set color(value: ColorSource)
    {
        this._color.setValue(value);
        const [r, g, b] = this._color.toArray();

        this.uniforms.uColor[0] = r;
        this.uniforms.uColor[1] = g;
        this.uniforms.uColor[2] = b;
    }

    /**
    * The alpha of the glow
    * @default 1
    */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }

    /**
    * A number between 0 and 1 that describes the quality of the glow. The higher the number the less performant
    * @default 0.1
    */
    get quality(): number { return this.uniforms.uQuality; }
    set quality(value: number) { this.uniforms.uQuality = value; }

    /**
    * Only draw the glow, not the texture itself
    * @default false
    */
    get knockout(): boolean { return this.uniforms.uKnockout === 1; }
    set knockout(value: boolean) { this.uniforms.uKnockout = value ? 1 : 0; }
}
