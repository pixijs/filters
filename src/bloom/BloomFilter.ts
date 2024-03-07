/* eslint-disable max-len */
import {
    AlphaFilter,
    BlurFilterPass,
    deprecation,
    FilterSystem,
    PointData,
    RenderSurface,
    Texture,
    TexturePool,
} from 'pixi.js';

type DeprecatedBlurValue = number | PointData | number[];

/** Options for the BloomFilter constructor. */
export interface BloomFilterOptions
{
    /**
     * Sets the strength of the blur. If only a number is provided, it will assign to both x and y.
     * @default {x:2,y:2}
     */
    strength?: PointData | number;
    /**
     * The quality of the blur.
     * @default 4
     */
    quality?: number;
    /**
     * The resolution of the blurX & blurY filter.
     * @default 1
     */
    resolution?: number;
    /**
     * The kernel size of the blur filter. Must be an odd number between 5 and 15 (inclusive).
     * @default 5
     */
    kernelSize?: number;
}

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.<br>
 * ![original](../screenshots/original.png)![filter](../screenshots/bloom.png)
 *
 * @class
 * @extends Filter
 */
export class BloomFilter extends AlphaFilter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: BloomFilterOptions = {
        strength: { x: 2, y: 2 },
        quality: 4,
        resolution: 1,
        kernelSize: 5
    };

    private _blurXFilter: BlurFilterPass;
    private _blurYFilter: BlurFilterPass;
    private _strength: PointData;

    /**
     * @param {BloomFilterOptions} options - Options for the BloomFilter constructor.
     */
    constructor(options?: BloomFilterOptions);
    /**
    * @deprecated since 6.0.0
    *
    * @param {number|PIXI.PointData|number[]} [blur=2] - Sets the strength of both the blurX and blurY properties simultaneously
    * @param {number} [quality=4] - The quality of the blurX & blurY filter.
    * @param {number} [resolution=1] - The resolution of the blurX & blurY filter.
    * @param {number} [kernelSize=5] - The kernelSize of the blurX & blurY filter.Options: 5, 7, 9, 11, 13, 15.
    */
    constructor(blur?: DeprecatedBlurValue, quality?: number, resolution?: number, kernelSize?: number);
    /** @ignore */
    constructor(...args: [BloomFilterOptions?] | [DeprecatedBlurValue?, number?, number?, number?])
    {
        let options = args[0] ?? {};

        if (typeof options === 'number' || Array.isArray(options) || ('x' in options && 'y' in options))
        {
            // eslint-disable-next-line max-len
            deprecation('6.0.0', 'BloomFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }');

            let strength = options;

            if (Array.isArray(strength)) strength = { x: strength[0], y: strength[1] };

            options = { strength };

            if (args[1] !== undefined) options.quality = args[1];
            if (args[2] !== undefined) options.resolution = args[2];
            if (args[3] !== undefined) options.kernelSize = args[3];
        }

        options = { ...BloomFilter.DEFAULT_OPTIONS, ...options } as BloomFilterOptions;

        super();

        this._strength = { x: 2, y: 2 };

        if (options.strength)
        {
            if (typeof options.strength === 'number')
            {
                this._strength.x = options.strength;
                this._strength.y = options.strength;
            }
            else
            {
                this._strength.x = options.strength.x;
                this._strength.y = options.strength.y;
            }
        }

        this._blurXFilter = new BlurFilterPass({
            ...options,
            horizontal: true,
            strength: this.strengthX,
        });

        this._blurYFilter = new BlurFilterPass({
            ...options,
            horizontal: false,
            strength: this.strengthY,
        });

        this._blurYFilter.blendMode = 'screen';

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
        clear: boolean,
    ): void
    {
        const renderTarget = TexturePool.getSameSizeTexture(input);

        filterManager.applyFilter(this, input, output, clear);
        this._blurXFilter.apply(filterManager, input, renderTarget, true);
        this._blurYFilter.apply(filterManager, renderTarget, output, false);

        TexturePool.returnTexture(renderTarget);
    }

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     */
    get strength(): PointData { return this._strength; }
    set strength(value: PointData | number)
    {
        this._strength = typeof value === 'number' ? { x: value, y: value } : value;
        this._updateStrength();
    }

    /**
     * Sets the strength of the blur on the `x` axis
     * @default 2
     */
    get strengthX(): number { return this.strength.x; }
    set strengthX(value: number)
    {
        this.strength.x = value;
        this._updateStrength();
    }

    /**
     * Sets the strength of the blur on the `y` axis
     * @default 2
     */
    get strengthY(): number { return this.strength.y; }
    set strengthY(value: number)
    {
        this.strength.y = value;
        this._updateStrength();
    }

    private _updateStrength()
    {
        this._blurXFilter.blur = this.strengthX;
        this._blurYFilter.blur = this.strengthY;
    }

    /**
     * @deprecated since 6.0.0
     *
     * The strength of both the blurX and blurY properties simultaneously
     * @default 2
     * @see BloomFilter#strength
     */
    get blur(): number
    {
        deprecation('6.0.0', 'BloomFilter.blur is deprecated, please use BloomFilter.strength instead');

        return this.strengthX;
    }
    set blur(value: number)
    {
        deprecation('6.0.0', 'BloomFilter.blur is deprecated, please use BloomFilter.strength instead');

        this.strength = value;
    }

    /**
     * @deprecated since 6.0.0
     *
     * The strength of the blurX property
     * @default 2
     * @see BloomFilter#strengthX
     */
    get blurX(): number
    {
        deprecation('6.0.0', 'BloomFilter.blurX is deprecated, please use BloomFilter.strengthX instead');

        return this.strengthX;
    }
    set blurX(value: number)
    {
        deprecation('6.0.0', 'BloomFilter.blurX is deprecated, please use BloomFilter.strengthX instead');

        this.strengthX = value;
    }

    /**
     * @deprecated since 6.0.0
     *
     * The strength of the blurY property
     * @default 2
     * @see BloomFilter#strengthY
     */
    get blurY(): number
    {
        deprecation('6.0.0', 'BloomFilter.blurY is deprecated, please use BloomFilter.strengthY instead');

        return this.strengthY;
    }
    set blurY(value: number)
    {
        deprecation('6.0.0', 'BloomFilter.blurY is deprecated, please use BloomFilter.strengthY instead');

        this.strengthY = value;
    }
}
