import { deprecation, Filter, GlProgram, GpuProgram, SCALE_MODE, Texture, TextureSource } from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './color-map.frag';
import source from './color-map.wgsl';

type ColorMapTexture = TextureSource | Texture;

/** Options for the ColorMapFilter constructor. */
export interface ColorMapFilterOptions
{
    /** The colorMap texture of the filter. */
    colorMap: ColorMapTexture;
    /**
     *  The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image.
     * @default 1
     */
    mix?: number;
    /**
     * Whether use NEAREST scale mode for `colorMap` texture.
     * @default false
     */
    nearest?: boolean;
}

/**
 * The ColorMapFilter applies a color-map effect to an object.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/color-map.png)
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
        uSliceSize: number;
        uSlicePixelSize: number;
        uSliceInnerSize: number;
    };

    private _size = 0;
    private _sliceSize = 0;
    private _slicePixelSize = 0;
    private _sliceInnerSize = 0;
    private _nearest = false;
    private _scaleMode: SCALE_MODE = 'linear';
    private _colorMap!: ColorMapTexture;

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
                colorMapUniforms: {
                    uMix: { value: options.mix, type: 'f32' },
                    uSize: { value: 0, type: 'f32' },
                    uSliceSize: { value: 0, type: 'f32' },
                    uSlicePixelSize: { value: 0, type: 'f32' },
                    uSliceInnerSize: { value: 0, type: 'f32' },
                },
                uMapTexture: options.colorMap.source,
                uMapSampler: options.colorMap.source.style,
            },
        });

        this.uniforms = this.resources.colorMapUniforms.uniforms;

        Object.assign(this, options);
    }

    /** The mix from 0 to 1, where 0 is the original image and 1 is the color mapped image. */
    get mix(): number { return this.uniforms.uMix; }
    set mix(value: number) { this.uniforms.uMix = value; }

    /**
     * The size of one color slice.
     * @readonly
     */
    get colorSize(): number { return this._size; }

    /** The colorMap texture. */
    get colorMap(): ColorMapTexture { return this._colorMap; }
    set colorMap(value: ColorMapTexture)
    {
        if (!value || value === this.colorMap) return;

        const source = value instanceof Texture ? value.source : value;

        source.style.scaleMode = this._scaleMode;
        source.autoGenerateMipmaps = false;

        this._size = source.height;
        this._sliceSize = 1 / this._size;
        this._slicePixelSize = this._sliceSize / this._size;
        this._sliceInnerSize = this._slicePixelSize * (this._size - 1);

        this.uniforms.uSize = this._size;
        this.uniforms.uSliceSize = this._sliceSize;
        this.uniforms.uSlicePixelSize = this._slicePixelSize;
        this.uniforms.uSliceInnerSize = this._sliceInnerSize;

        this.resources.uMapTexture = source;
        this._colorMap = value;
    }

    /** Whether use NEAREST for colorMap texture. */
    get nearest(): boolean { return this._nearest; }
    set nearest(nearest: boolean)
    {
        this._nearest = nearest;
        this._scaleMode = nearest ? 'nearest' : 'linear';

        const texture = this._colorMap;

        if (texture && texture.source)
        {
            texture.source.scaleMode = this._scaleMode;
            texture.source.autoGenerateMipmaps = false;
            texture.source.style.update();
            texture.source.update();
        }
    }

    /**
     * If the colorMap is based on canvas,
     * and the content of canvas has changed, then call `updateColorMap` for update texture.
     */
    updateColorMap(): void
    {
        const texture = this._colorMap;

        if (texture?.source)
        {
            texture.source.update();
            this.colorMap = texture;
        }
    }

    /**
     * Destroys this filter
     * @default false
     */
    destroy(): void
    {
        this._colorMap?.destroy(/** true | TODO: Should base texture be destroyed? **/);
        super.destroy();
    }
}
