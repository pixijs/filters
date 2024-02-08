import {
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
import fragment from './advanced-bloom.frag';
import source from './advanced-bloom.wgsl';
import { ExtractBrightnessFilter } from './ExtractBrightnessFilter';

type DeprecatedPixelSizeValue = PointData | number[] | number;

interface DeprecatedAdvancedBloomFilterOptions
{
    threshold: number,
    bloomScale: number,
    brightness: number,
    kernels: number[] | null,
    blur: number,
    quality: number,
    pixelSize: DeprecatedPixelSizeValue,
    resolution: number,
}

export interface AdvancedBloomFilterOptions
{
    /**
     * Defines how bright a color needs to be to affect bloom.
     * @default 1
     */
    threshold?: number,
    /**
     * To adjust the strength of the bloom. Higher values is more intense brightness.
     * @default 1
     */
    bloomScale?: number,
    /**
     * The brightness, lower value is more subtle brightness, higher value is blown-out.
     * @default 1
     */
    brightness?: number,
    /** The strength of the Blur properties simultaneously */
    blur?: number,
    /**
     * The kernel size of the blur filter.
     */
    kernels?: number[],
    /** The quality of the Blur filter. */
    quality?: number,
    /**
     * The pixel size of the blur filter. Large size is blurrier. For advanced usage.
     * @default {x:1,y:1}
     */
    pixelSize?: PointData,
}

/**
 * The AdvancedBloomFilter applies a Bloom Effect to an object. Unlike the normal BloomFilter
 * this had some advanced controls for adjusting the look of the bloom. Note: this filter
 * is slower than normal BloomFilter.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/advanced-bloom.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class AdvancedBloomFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: AdvancedBloomFilterOptions = {
        threshold: 0.5,
        bloomScale: 1,
        brightness: 1,
        blur: 8,
        quality: 4,
        pixelSize: { x: 1, y: 1 },
    };

    public uniforms: {
        uBloomScale: number;
        uBrightness: number;
    };

    /** To adjust the strength of the bloom. Higher values is more intense brightness. */
    public bloomScale = 1;

    /** The brightness, lower value is more subtle brightness, higher value is blown-out. */
    public brightness = 1;

    private _extractFilter: ExtractBrightnessFilter;
    private _blurFilter: KawaseBlurFilter;

    constructor(options?: AdvancedBloomFilterOptions);
    /**
     * @deprecated since 8.0.0
     *
     * @param {object|number} [options] - The optional parameters of advanced bloom filter.
     *                        When options is a number , it will be `options.threshold`.
     * @param {number} [options.threshold=0.5] - Defines how bright a color needs to be to affect bloom.
     * @param {number} [options.bloomScale=1.0] - To adjust the strength of the bloom. Higher values is
     *        more intense brightness.
     * @param {number} [options.brightness=1.0] - The brightness, lower value is more subtle brightness,
     *        higher value is blown-out.
     * @param {number} [options.blur=8] - Sets the strength of the Blur properties simultaneously
     * @param {number} [options.quality=4] - The quality of the Blur filter.
     * @param {number[]} [options.kernels=null] - The kernels of the Blur filter.
     * @param {number|number[]|PIXI.PointData} [options.pixelSize=1] - the pixelSize of the Blur filter.
     * @param {number} [options.resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the Blur filter.
     */
    constructor(options?: Partial<DeprecatedAdvancedBloomFilterOptions>);
    constructor(options?: AdvancedBloomFilterOptions | Partial<DeprecatedAdvancedBloomFilterOptions>)
    {
        if (typeof options?.pixelSize === 'number' || Array.isArray(options?.pixelSize))
        {
            deprecation(v8_0_0, 'AdvancedBloomFilterOptions.pixelSize now only accepts {x, y} PointData type.');
            options.pixelSize = convertDeprecatedPixelSize(options.pixelSize);
        }

        options = { ...AdvancedBloomFilter.DEFAULT_OPTIONS, ...options };

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
            name: 'advanced-bloom-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                advancedBloomUniforms: {
                    uBloomScale: { value: options.bloomScale, type: 'f32' },
                    uBrightness: { value: options.brightness, type: 'f32' },
                },
                uMapTexture: Texture.WHITE,
            },
        });

        this.uniforms = this.resources.advancedBloomUniforms.uniforms;

        this._extractFilter = new ExtractBrightnessFilter({
            threshold: options.threshold
        });

        this._blurFilter = new KawaseBlurFilter({
            strength: options.kernels as [number, number] ?? options.blur,
            quality: options.kernels ? undefined : options.quality,
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
        clearMode: boolean
    ): void
    {
        const brightTarget = TexturePool.getSameSizeTexture(input);

        this._extractFilter.apply(filterManager, input, brightTarget, true);

        const bloomTarget = TexturePool.getSameSizeTexture(input);

        this._blurFilter.apply(filterManager, brightTarget, bloomTarget, true);

        this.uniforms.uBloomScale = this.bloomScale;
        this.uniforms.uBrightness = this.brightness;

        this.resources.uMapTexture = bloomTarget.source;

        filterManager.applyFilter(this, input, output, clearMode);

        TexturePool.returnTexture(bloomTarget);
        TexturePool.returnTexture(brightTarget);
    }

    /**
     * Defines how bright a color needs to be extracted.
     * @default 0.5
     */
    get threshold(): number { return this._extractFilter.threshold; }
    set threshold(value: number) { this._extractFilter.threshold = value; }

    /** The kernels of the Blur Filter */
    get kernels(): number[] { return this._blurFilter.kernels; }
    set kernels(value: number[]) { this._blurFilter.kernels = value; }

    /**
     * The strength of the Blur properties simultaneously
     * @default 2
     */
    get blur(): number { return this._blurFilter.strength; }
    set blur(value: number) { this._blurFilter.strength = value; }

    /**
     * The quality of the Blur Filter
     * @default 4
     */
    get quality(): number { return this._blurFilter.quality; }
    set quality(value: number) { this._blurFilter.quality = value; }

    /**
     * The pixel size of the Kawase Blur filter
     * @default {x:1,y:1}
     */
    get pixelSize(): PointData { return this._blurFilter.pixelSize; }
    set pixelSize(value: PointData | DeprecatedPixelSizeValue)
    {
        if (typeof value === 'number' || Array.isArray(value))
        {
            deprecation(v8_0_0, 'AdvancedBloomFilter.pixelSize now only accepts {x, y} PointData type.');
            this._blurFilter.pixelSize = convertDeprecatedPixelSize(value);

            return;
        }

        this._blurFilter.pixelSize = value;
    }

    /**
     * The horizontal pixelSize of the Kawase Blur filter
     * @default 1
     */
    get pixelSizeX(): number { return this._blurFilter.pixelSizeX; }
    set pixelSizeX(value: number) { this._blurFilter.pixelSizeX = value; }

    /**
     * The vertical pixel size of the Kawase Blur filter
     * @default 1
     */
    get pixelSizeY(): number { return this._blurFilter.pixelSizeY; }
    set pixelSizeY(value: number) { this._blurFilter.pixelSizeY = value; }
}

function convertDeprecatedPixelSize(value: DeprecatedPixelSizeValue): PointData
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
