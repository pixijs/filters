import {
    Color,
    ColorSource,
    Filter,
    FilterSystem,
    GlProgram,
    GpuProgram,
    PointData,
    RenderSurface,
    Texture,
    TexturePool,
} from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import { KawaseBlurFilter } from '../kawase-blur/KawaseBlurFilter';
import fragment from './drop-shadow.frag';
import source from './drop-shadow.wgsl';

/** Options for the DropShadowFilter constructor. */
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
    pixelSize?: PointData | number[] | number;
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

    /**
     * @param options - Options for the DropShadowFilter constructor.
     */
    constructor(options?: DropShadowFilterOptions)
    {
        options = { ...DropShadowFilter.DEFAULT_OPTIONS, ...options };

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
            gpuProgram: GpuProgram.from({
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
            glProgram: GlProgram.from({
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
    set pixelSize(value: PointData | number[] | number)
    {
        if (typeof value === 'number')
        {
            value = { x: value, y: value };
        }

        if (Array.isArray(value))
        {
            value = { x: value[0], y: value[1] };
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
