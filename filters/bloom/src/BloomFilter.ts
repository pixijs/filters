import { AlphaFilter, BlurFilterPass, FilterSystem, Point, RenderSurface, Texture, TexturePool } from 'pixi.js';

type BlurValue = number | Point | [number, number];

export interface BloomFilterOptions
{
    /**
     * Sets the strength of the blur. If only a number is provided, it will assign to both x and y.
     * @default [2,2]
     */
    strength?: BlurValue;
    /**
     * The quality of the blur.
     * @default 4
     */
    quality?: number;
    /**
     * The kernel size of the blur filter. Must be an odd number between 5 and 15 (inclusive).
     * @default 5
     */
    kernelSize?: number;
}

/**
 * The BloomFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/bloom.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-bloom|@pixi/filter-bloom}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class BloomFilter extends AlphaFilter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: BloomFilterOptions = {
        strength: [2, 2],
        quality: 4,
        kernelSize: 5
    };

    private _blurXFilter: BlurFilterPass;
    private _blurYFilter: BlurFilterPass;
    private _strength: BlurValue;

    constructor(options?: BloomFilterOptions)
    {
        options = { ...BloomFilter.DEFAULT_OPTIONS, ...options };

        super();

        this._strength = options.strength ?? 2;
        let strengthX;
        let strengthY;

        if (Array.isArray(this._strength))
        {
            strengthX = this._strength[0];
            strengthY = this._strength[1];
        }
        else if (this._strength instanceof Point)
        {
            strengthX = this._strength.x;
            strengthY = this._strength.y;
        }
        else
        {
            strengthX = strengthY = this._strength;
        }

        this._blurXFilter = new BlurFilterPass({
            ...options,
            horizontal: true,
            strength: strengthX
        });

        this._blurYFilter = new BlurFilterPass({
            ...options,
            horizontal: false,
            strength: strengthY
        });

        this._blurYFilter.blendMode = 'screen';
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public override apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clear: boolean): void
    {
        const tempTexture = TexturePool.getSameSizeTexture(input);
        const tempTexture2 = TexturePool.getSameSizeTexture(input);

        filterManager.applyFilter(this, input, tempTexture, false);
        filterManager.applyFilter(this._blurXFilter, tempTexture, tempTexture2, false);
        filterManager.applyFilter(this._blurYFilter, tempTexture2, output, clear);

        TexturePool.returnTexture(tempTexture);
        TexturePool.returnTexture(tempTexture2);
    }

    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     */
    get strength(): BlurValue { return this._strength; }
    set strength(value: BlurValue)
    {
        if (value === this._strength) return;
        this._strength = value;
        this._updateStrength();
    }

    /**
     * Sets the strength of the blur on the `x` axis
     * @default 2
     */
    get strengthX(): number { return this._blurXFilter.strength; }
    set strengthX(value: number) { this._blurXFilter.strength = value; }

    /**
     * Sets the strength of the blur on the `y` axis
     * @default 2
     */
    get strengthY(): number { return this._blurYFilter.strength; }
    set strengthY(value: number) { this._blurYFilter.strength = value; }

    private _updateStrength()
    {
        let strengthX;
        let strengthY;

        if (Array.isArray(this._strength))
        {
            strengthX = this._strength[0];
            strengthY = this._strength[1];
        }
        else if (this._strength instanceof Point)
        {
            strengthX = this._strength.x;
            strengthY = this._strength.y;
        }
        else
        {
            strengthX = strengthY = this._strength;
        }

        this._blurXFilter.strength = strengthX;
        this._blurYFilter.strength = strengthY;
    }
}

