import { Color, ColorSource, DEG_TO_RAD, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './bevel.frag';
import source from './bevel.wgsl';

/** Options for the BevelFilter constructor. */
export interface BevelFilterOptions
{
    /**
     * The angle of the light in degrees
     * @default 45
     */
    rotation?: number,
    /**
     * The thickness of the bevel
     * @default 2
     */
    thickness?: number,
    /**
     * The color value of the left & top bevel.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0xffffff
     */
    lightColor?: ColorSource,
    /**
     * The alpha value of the left & top bevel.
     * @default 0.7
     */
    lightAlpha?: number,
    /**
     * The color value of the right & bottom bevel.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
     */
    shadowColor?: ColorSource,
    /**
     * The alpha value of the right & bottom bevel.
     * @default 0.7
     */
    shadowAlpha?: number,
}

/**
 * Bevel Filter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/bevel.png)
 *
 * @class
 * @extends Filter
 */
export class BevelFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: BevelFilterOptions = {
        rotation: 45,
        thickness: 2,
        lightColor: 0xffffff,
        lightAlpha: 0.7,
        shadowColor: 0x000000,
        shadowAlpha: 0.7,
    };

    public uniforms: {
        uLightColor: Float32Array;
        uLightAlpha: number;
        uShadowColor: Float32Array;
        uShadowAlpha: number;
        uTransform: Float32Array;
    };

    private _thickness!: number;
    private _rotation!: number;
    private _lightColor: Color;
    private _shadowColor: Color;

    /**
     * @param options - Options for the BevelFilter constructor.
     */
    constructor(options?: BevelFilterOptions)
    {
        options = { ...BevelFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'bevel-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                bevelUniforms: {
                    uLightColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uLightAlpha: { value: options.lightAlpha, type: 'f32' },
                    uShadowColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uShadowAlpha: { value: options.shadowAlpha, type: 'f32' },
                    uTransform: { value: new Float32Array(2), type: 'vec2<f32>' },
                }
            },
            // Workaround: https://github.com/pixijs/filters/issues/230
            // applies correctly only if there is at least a single-pixel padding with alpha=0 around an image
            // To solve this problem, a padding of 1 put on the filter should suffice
            padding: 1,
        });

        this.uniforms = this.resources.bevelUniforms.uniforms;
        this._lightColor = new Color();
        this._shadowColor = new Color();
        this.lightColor = options.lightColor ?? 0xffffff;
        this.shadowColor = options.shadowColor ?? 0x000000;

        Object.assign(this, options);
    }

    /**
     * The angle of the light in degrees
     * @default 45
     */
    get rotation(): number { return this._rotation / DEG_TO_RAD; }
    set rotation(value: number)
    {
        this._rotation = value * DEG_TO_RAD;
        this._updateTransform();
    }

    /**
     * The thickness of the bevel
     * @default 2
     */
    get thickness(): number { return this._thickness; }
    set thickness(value: number)
    {
        this._thickness = value;
        this._updateTransform();
    }

    /**
     * The color value of the left & top bevel.
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0xffffff
     */
    get lightColor(): ColorSource { return this._lightColor.value as ColorSource; }
    set lightColor(value: ColorSource)
    {
        this._lightColor.setValue(value);
        const [r, g, b] = this._lightColor.toArray();

        this.uniforms.uLightColor[0] = r;
        this.uniforms.uLightColor[1] = g;
        this.uniforms.uLightColor[2] = b;
    }

    /**
     * The alpha value of the left & top bevel.
     * @default 0.7
     */
    get lightAlpha(): number { return this.uniforms.uLightAlpha; }
    set lightAlpha(value: number) { this.uniforms.uLightAlpha = value; }

    /**
     * The color value of the right & bottom bevel.
     * @default 0xffffff
     */
    get shadowColor(): ColorSource { return this._shadowColor.value as ColorSource; }
    set shadowColor(value: ColorSource)
    {
        this._shadowColor.setValue(value);
        const [r, g, b] = this._shadowColor.toArray();

        this.uniforms.uShadowColor[0] = r;
        this.uniforms.uShadowColor[1] = g;
        this.uniforms.uShadowColor[2] = b;
    }

    /**
     * The alpha value of the right & bottom bevel.
     * @default 0.7
     */
    get shadowAlpha(): number { return this.uniforms.uShadowAlpha; }
    set shadowAlpha(value: number) { this.uniforms.uShadowAlpha = value; }

    /**
     * Update the transform matrix of offset angle.
     * @private
     */
    private _updateTransform()
    {
        this.uniforms.uTransform[0] = this.thickness * Math.cos(this._rotation);
        this.uniforms.uTransform[1] = this.thickness * Math.sin(this._rotation);
    }
}
