import { deprecation, Filter, GlProgram, GpuProgram, Texture, TextureSource } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './color-map.frag';
import source from './color-map.wgsl';

/**
 * The texture must be `height` x `height^2` and divided into square slices.
 * Each slice maps a color channel from 0-1 along the positive x (red) and y
 * (green) axis. Each slice in sequence maps the shift in the blue channel.
 *
 * A 2x4 map would therefore look like this (each sub array is a row and each sub array
 * of those represents an [r, g, b] pixel):
 * ```
 * [
 *   [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1]],
 *   [[0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]]
 * ]
 * ```
 *
 * The first two pixels of each row are used to sample the color where the blue channel
 * is 0 and pixel three and four are for where the blue channel is 1. The map can not
 * transform alpha.
 *
 * This is a very small map and will not look very smooth.
 * A usably large map would be to big to show as an example.
 *
 * A common pitfall when generating a color map texture is forgetting to work in
 * a linear color space.
 **/
type ColorMapTexture = TextureSource | Texture;

/** Options for the ColorMapFilter constructor. */
export interface ColorMapFilterOptions
{
    /**
     * The colorMap texture.
     **/
    colorMap: ColorMapTexture;
    /**
     *  The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     * @default 1
     */
    mix?: number;
    /**
     * Whether use NEAREST scale mode for `colorMap` texture. Does not affect alpha.
     * @default false
     */
    nearest?: boolean;
}

/**
 * The ColorMapFilter applies a color-map effect.
 *
 * @class
 * @extends Filter
 */
export class ColorMapFilter extends Filter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: ColorMapFilterOptions = {
        colorMap: Texture.WHITE,
        nearest: false,
        mix: 1
    };

    public uniforms: {
        uMix: number;
        uSize: number;
        uPixelSize: number;
        uSlicePixelSize: number;
        uNearest: number;
    };

    private _size = 0;
    private _nearest = false;
    private _colorMap: ColorMapTexture;

    /**
     * @param options - Options for the ColorMapFilter constructor.
     */
    constructor(options: ColorMapFilterOptions);
    /**
     * @deprecated since 6.0.0
     *
     * @param {HTMLImageElement|HTMLCanvasElement|PIXI.BaseTexture|PIXI.Texture} [colorMap] - The
     *        colorMap texture of the filter.
     * @param {boolean} [nearest=false] - Whether use NEAREST for colorMap texture.
     * @param {number} [mix=1] - The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     */
    constructor(colorMap: ColorMapTexture, nearest?: boolean, mix?: number);
    /** @ignore */
    constructor(...args: [ColorMapFilterOptions] | [ColorMapTexture, boolean?, number?])
    {
        let options = args[0] ?? {};

        if (options instanceof Texture || options instanceof TextureSource)
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'ColorMapFilter constructor params are now options object. See params: { colorMap, nearest, mix }');

            options = { colorMap: options };

            if (args[1] !== undefined) options.nearest = args[1];
            if (args[2] !== undefined) options.mix = args[2];
        }

        options = { ...ColorMapFilter.DEFAULT_OPTIONS, ...options };

        if (!options.colorMap) throw Error('No color map texture source was provided to ColorMapFilter');

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
            name: 'color-map-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                cmu: {
                    uMix: { value: options.mix, type: 'f32' },
                    uSize: { value: 0, type: 'f32' },
                    uPixelSize: { value: 0, type: 'f32' },
                    uSlicePixelSize: { value: 0, type: 'f32' },
                    uNearest: { value: 0, type: 'f32' },
                },
                uMapTexture: options.colorMap.source,
                uMapSampler: options.colorMap.source.style,
            },
        });

        this.uniforms = this.resources.cmu.uniforms;

        this.colorMap = options.colorMap;
        this._colorMap = options.colorMap;
        this.nearest = options.nearest ?? this.nearest;
    }

    /** The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image. */
    get mix(): number { return this.uniforms.uMix; }
    set mix(value: number) { this.uniforms.uMix = value; }

    /**
     * The size of one color slice.
     * @readonly
     */
    get colorSize(): number { return this._size; }

    /**
     * @inheritdoc ColorMapFilterOptions.colorMap
     **/
    get colorMap(): ColorMapTexture { return this._colorMap; }
    set colorMap(value: ColorMapTexture)
    {
        if (!value) return;

        const source = value instanceof Texture ? value.source : value;

        if (source.height !== source.width / source.height)
        {
            throw new Error('The color map must have a resolution that matches H x H**2');
        }

        source.style.scaleMode = this._nearest ? 'nearest' : 'linear';
        source.autoGenerateMipmaps = false;

        this._size = source.height;

        this.uniforms.uSize = source.height;
        this.uniforms.uPixelSize = 1 / source.height;
        this.uniforms.uSlicePixelSize = this.uniforms.uPixelSize / source.height;

        this.resources.uMapTexture = source;
        this.resources.uMapSampler = source.style;
        this._colorMap = value;
    }

    /** Whether use NEAREST for colorMap texture. Does not affect alpha. */
    get nearest(): boolean { return this._nearest; }
    set nearest(nearest: boolean)
    {
        this._nearest = nearest;

        if (!this._colorMap?.source) return;

        this._colorMap.source.scaleMode = this._nearest ? 'nearest' : 'linear';
        this._colorMap.source.autoGenerateMipmaps = false;
        this._colorMap.source.style.update();
        this._colorMap.source.update();
    }

    /**
     * If the colorMap is based on canvas,
     * and the content of canvas has changed,
     * then call `updateColorMap` for update texture.
     */
    updateColorMap(): void
    {
        if (!this._colorMap?.source) return;

        this._colorMap.source.update();
        this.colorMap = this._colorMap;
    }

    /**
     * Destroys this filter
     */
    destroy(): void
    {
        this._colorMap?.destroy(/** true | TODO: Should base texture be destroyed? **/);
        super.destroy();
    }
}
