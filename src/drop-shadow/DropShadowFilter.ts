import {
    Color,
    ColorSource,
    deprecation,
    Filter,
    FilterSystem,
    GlProgram,
    GpuProgram,
    PointData,
    RenderSurface,
    Texture,
    TexturePool,
    // eslint-disable-next-line camelcase
    v8_0_0,
} from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import { KawaseBlurFilter } from '../kawase-blur/KawaseBlurFilter';
import fragment from './drop-shadow.frag';
import source from './drop-shadow.wgsl';

type DeprecatedPixelSizeValue = PointData | number[] | number;

interface DeprecatedDropShadowFilterOptions
{
    offset: PointData;
    color: ColorSource;
    alpha: number;
    shadowOnly: boolean;
    blur: number;
    quality: number;
    kernels: number[] | null;
    pixelSize: DeprecatedPixelSizeValue;
    resolution: number;
}

export interface DropShadowFilterOptions
{
    /**
     * The offset position of the drop-shadow relative to the original image.
     * @default {x:4,y:4}
     */
    offset?: PointData;
    /**
     * The color value of shadow.
     * @example [0.0, 0.0, 0.0] = 0x000000
     * @default 0x000000
     */
    color?: ColorSource;
    /**
     * Coefficient for alpha multiplication.
     * @default 1
     */
    alpha?: number;
    /**
     * Hide the contents, only show the shadow.
     * @default false
     */
    shadowOnly?: boolean;
    /**
     * The strength of the shadow's blur.
     * @default 2
     */
    blur?: number;
    /**
     * The quality of the Blur Filter.
     * @default 4
     */
    quality?: number;
    /**
     * The kernel size of the blur filter.
     * @default null
     */
    kernels?: number[];
    /**
     * The pixelSize of the Kawase Blur filter
     * @default {x:1,y:1}
     */
    pixelSize?: PointData;
    /**
     * The resolution of the Kawase Blur filter
     * @default 1
     */
    resolution?: number;
}

/**
 * Drop shadow filter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/drop-shadow.png)
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class DropShadowFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: DropShadowFilterOptions = {
        offset: { x: 4, y: 4 },
        color: 0x000000,
        alpha: 0.5,
        shadowOnly: false,
        kernels: undefined,
        blur: 2,
        quality: 3,
        pixelSize: { x: 1, y: 1 },
        resolution: 1,
    };

    public uniforms: {
        uAlpha: number;
        uColor: Float32Array;
        uOffset: PointData;
    };

    /**
     * Hide the contents, only show the shadow.
     * @default false
     */
    public shadowOnly = false;

    private _color!: Color;
    private _blurFilter: KawaseBlurFilter;
    private _basePass: Filter;

    constructor(options?: DropShadowFilterOptions);
    /**
     * @deprecated since 8.0.0
     *
     * @param {object} [options] - Filter options
     * @param {PIXI.PointData} [options.offset={x: 4, y: 4}] - Offset of the shadow
     * @param {number} [options.color=0x000000] - Color of the shadow
     * @param {number} [options.alpha=0.5] - Alpha of the shadow
     * @param {boolean} [options.shadowOnly=false] - Whether render shadow only
     * @param {number} [options.blur=2] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=3] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.PointData} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=1] - The resolution of the Blur filter.
     */
    constructor(options?: Partial<DeprecatedDropShadowFilterOptions>);
    constructor(options?: DropShadowFilterOptions | Partial<DeprecatedDropShadowFilterOptions>)
    {
        if (typeof options?.pixelSize === 'number' || Array.isArray(options?.pixelSize))
        {
            deprecation(v8_0_0, 'DropShadowFilterOptions.pixelSize now only accepts {x, y} PointData type.');
            options.pixelSize = convertDeprecatedPixelSizeValue(options.pixelSize);
        }

        options = { ...DropShadowFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'drop-shadow-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                dropShadowUniforms: {
                    uAlpha: { value: options.alpha, type: 'f32' },
                    uColor: { value: new Float32Array(3), type: 'vec3<f32>' },
                    uOffset: { value: options.offset, type: 'vec2<f32>' },
                }
            },
            resolution: options.resolution,
        });

        this.uniforms = this.resources.dropShadowUniforms.uniforms;
        this._color = new Color();
        this.color = options.color ?? 0x000000;

        this._blurFilter = new KawaseBlurFilter({
            strength: options.kernels as [number, number] ?? options.blur,
            quality: options.kernels ? undefined : options.quality,
        });

        this._basePass = new Filter({
            gpuProgram: new GpuProgram({
                vertex: {
                    source: wgslVertex,
                    entryPoint: 'mainVertex',
                },
                fragment: {
                    source: `
                    @group(0) @binding(1) var uTexture: texture_2d<f32>; 
                    @group(0) @binding(2) var uSampler: sampler;
                    @fragment
                    fn mainFragment(
                        @builtin(position) position: vec4<f32>,
                        @location(0) uv : vec2<f32>
                    ) -> @location(0) vec4<f32> {
                        return textureSample(uTexture, uSampler, uv);
                    }
                    `,
                    entryPoint: 'mainFragment',
                },
            }),
            glProgram: new GlProgram({
                vertex,
                fragment: `
                in vec2 vTextureCoord;
                out vec4 finalColor;
                uniform sampler2D uTexture;

                void main(void){
                    finalColor = texture(uTexture, vTextureCoord);
                }
                `,
                name: 'drop-shadow-filter',
            }),
            resources: {},
        });

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
        clearMode: boolean,
    ): void
    {
        const renderTarget = TexturePool.getSameSizeTexture(input);

        filterManager.applyFilter(this, input, renderTarget, true);
        this._blurFilter.apply(filterManager, renderTarget, output, clearMode);

        if (!this.shadowOnly)
        {
            filterManager.applyFilter(this._basePass, input, output, false);
        }

        TexturePool.returnTexture(renderTarget);
    }

    /**
     * Set the offset position of the drop-shadow relative to the original image.
     * @default [4,4]
     */
    public get offset(): PointData { return this.uniforms.uOffset; }
    public set offset(value: PointData)
    {
        this.uniforms.uOffset = value;
        this._updatePadding();
    }

    /**
     * Set the offset position of the drop-shadow relative to the original image on the `x` axis
     * @default 4
     */
    get offsetX(): number { return this.offset.x; }
    set offsetX(value: number)
    {
        this.offset.x = value;
        this._updatePadding();
    }

    /**
     * Set the offset position of the drop-shadow relative to the original image on the `y` axis
     * @default 4
     */
    get offsetY(): number { return this.offset.y; }
    set offsetY(value: number)
    {
        this.offset.y = value;
        this._updatePadding();
    }

    /**
     * The color value of shadow.
     * @example [0.0, 0.0, 0.0] = 0x000000
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
     * The strength of the shadow's blur.
     * @default 2
     */
    get blur(): number { return this._blurFilter.strength; }
    set blur(value: number)
    {
        this._blurFilter.strength = value;
        this._updatePadding();
    }

    /**
     * Sets the quality of the Blur Filter
     * @default 4
     */
    get quality(): number { return this._blurFilter.quality; }
    set quality(value: number)
    {
        this._blurFilter.quality = value;
        this._updatePadding();
    }

    /** Sets the kernels of the Blur Filter */
    get kernels(): number[] { return this._blurFilter.kernels; }
    set kernels(value: number[]) { this._blurFilter.kernels = value; }

    /**
     * Sets the pixelSize of the Kawase Blur filter
     * @default [1,1]
     */
    get pixelSize(): PointData
    {
        return this._blurFilter.pixelSize as PointData;
    }
    set pixelSize(value: PointData | DeprecatedPixelSizeValue)
    {
        if (typeof value === 'number' || Array.isArray(value))
        {
            deprecation(v8_0_0, 'KawaseBlurFilter.pixelSize now only accepts {x, y} PointData.');
            this._blurFilter.pixelSize = convertDeprecatedPixelSizeValue(value);

            return;
        }

        this._blurFilter.pixelSize = value;
    }

    /**
     * Sets the pixelSize of the Kawase Blur filter on the `x` axis
     * @default 1
     */
    get pixelSizeX(): number { return this._blurFilter.pixelSizeX; }
    set pixelSizeX(value: number) { this._blurFilter.pixelSizeX = value; }

    /**
     * Sets the pixelSize of the Kawase Blur filter on the `y` axis
     * @default 1
     */
    get pixelSizeY(): number { return this._blurFilter.pixelSizeY; }
    set pixelSizeY(value: number) { this._blurFilter.pixelSizeY = value; }

    /**
     * Recalculate the proper padding amount.
     * @private
     */
    private _updatePadding()
    {
        const offsetPadding = Math.max(
            Math.abs(this.offsetX),
            Math.abs(this.offsetY),
        );

        this.padding = offsetPadding + (this.blur * 2) + (this.quality * 4);
    }
}

function convertDeprecatedPixelSizeValue(value: DeprecatedPixelSizeValue): PointData
{
    if (typeof value === 'number')
    {
        return { x: value, y: value };
    }

    if (Array.isArray(value))
    {
        return { x: value[0], y: value[1] };
    }

    return value;
}
