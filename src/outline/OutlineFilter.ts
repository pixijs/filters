import { Color, deprecation, Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './outline.frag';
import source from './outline.wgsl';

import type { ColorSource, FilterSystem, RenderSurface, Texture } from 'pixi.js';

/** Options for the OutlineFilter constructor. */
export interface OutlineFilterOptions
{
    /**
     * The thickness of the outline
     * @default 1
     */
    thickness?: number;
    /**
     * The color of the outline
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
     */
    color?: ColorSource;
    /**
     * The alpha of the outline
     * @default 1
     */
    alpha?: number;
    /**
     * The quality of the outline from `0` to `1`.
     * Using a higher quality setting will result in more accuracy but slower performance
     * @default 0.1
     */
    quality?: number;
    /**
     * Whether to only render outline, not the contents.
     * @default false
     */
    knockout?: boolean;
}

/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/outline.png)
 *
 * @class
 * @extends Filter *
 * @example
 *  someSprite.filters = [new OutlineFilter(2, 0x99ff99)];
 */
export class OutlineFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: OutlineFilterOptions = {
        thickness: 1,
        color: 0x000000,
        alpha: 1,
        quality: 0.1,
        knockout: false,
    };

    /** The minimum number of samples for rendering outline. */
    public static MIN_SAMPLES = 1;

    /** The maximum number of samples for rendering outline. */
    public static MAX_SAMPLES = 100;

    public uniforms: {
        uThickness: Float32Array,
        uColor: Float32Array,
        uAlpha: number;
        uAngleStep: number,
        uKnockout: number,
    };

    private _thickness!: number;
    private _quality!: number;
    private _color!: Color;

    /**
     * @param options - Options for the OutlineFilter constructor.
     */
    constructor(options?: OutlineFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {number} [thickness=1] - The tickness of the outline. Make it 2 times more for resolution 2
     * @param {number} [color=0x000000] - The color of the outline.
     * @param {number} [quality=0.1] - The quality of the outline from `0` to `1`, using a higher quality
     *        setting will result in slower performance and more accuracy.
     * @param {number} [alpha=1.0] - The alpha of the outline.
     * @param {boolean} [knockout=false] - Only render outline, not the contents.
     */
    constructor(thickness?: number, color?: number, quality?: number, alpha?: number, knockout?: boolean);
    /** @ignore */
    constructor(...args: [OutlineFilterOptions?] | [number?, number?, number?, number?, boolean?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number')
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'OutlineFilter constructor params are now options object. See params: { thickness, color, quality, alpha, knockout }');

            options = { thickness: options };

            if (args[1] !== undefined) options.color = args[1];
            if (args[2] !== undefined) options.quality = args[2];
            if (args[3] !== undefined) options.alpha = args[3];
            if (args[4] !== undefined) options.knockout = args[4];
        }

        options = { ...OutlineFilter.DEFAULT_OPTIONS, ...options };

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

        const glProgram = GlProgram.from({
            vertex,
            fragment: fragment.replace(/\$\{ANGLE_STEP\}/, OutlineFilter.getAngleStep(quality).toFixed(7)),
            name: 'outline-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                outlineUniforms: {
                    uThickness: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uAlpha: { value: options.alpha, type: 'f32' },
                    uAngleStep: { value: 0, type: 'f32' },
                    uKnockout: { value: options.knockout ? 1 : 0, type: 'f32' },
                }
            },
        });

        this.uniforms = this.resources.outlineUniforms.uniforms;
        this.uniforms.uAngleStep = OutlineFilter.getAngleStep(quality);
        this._color = new Color();
        this.color = options.color ?? 0x000000;

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public override apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        this.uniforms.uThickness[0] = this.thickness / input.source.width;
        this.uniforms.uThickness[1] = this.thickness / input.source.height;

        filterManager.applyFilter(this, input, output, clearMode);
    }

    /**
     * Get the angleStep by quality
     * @param quality
     */
    private static getAngleStep(quality: number): number
    {
        return parseFloat(((Math.PI * 2) / Math.max(
            quality * OutlineFilter.MAX_SAMPLES,
            OutlineFilter.MIN_SAMPLES,
        )).toFixed(7));
    }

    /**
     * The thickness of the outline
     * @default 1
     */
    get thickness(): number { return this._thickness; }
    set thickness(value: number) { this._thickness = this.padding = value; }

    /**
     * The color value of the ambient color
     * @example [1.0, 1.0, 1.0] = 0xffffff
     * @default 0x000000
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
     * Coefficient for alpha multiplication
     * @default 1
     */
    get alpha(): number { return this.uniforms.uAlpha; }
    set alpha(value: number) { this.uniforms.uAlpha = value; }

    /**
     * The quality of the outline from `0` to `1`.
     * Using a higher quality setting will result in more accuracy but slower performance
     * @default 0.1
     */
    get quality(): number { return this._quality; }
    set quality(value: number)
    {
        this._quality = value;
        this.uniforms.uAngleStep = OutlineFilter.getAngleStep(value);
    }

    /**
     * Whether to only render outline, not the contents.
     * @default false
     */
    get knockout(): boolean { return this.uniforms.uKnockout === 1; }
    set knockout(value: boolean) { this.uniforms.uKnockout = value ? 1 : 0; }
}
