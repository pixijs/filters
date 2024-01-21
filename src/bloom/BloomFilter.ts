import { AlphaFilter, BlurFilterPass, FilterSystem, PointData, RenderSurface, Texture, TexturePool } from 'pixi.js';

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
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class BloomFilter extends AlphaFilter
{
    /** Default values for options. */
    public static readonly DEFAULT_OPTIONS: BloomFilterOptions = {
        strength: { x: 2, y: 2 },
        quality: 4,
        kernelSize: 5
    };

    private _blurXFilter: BlurFilterPass;
    private _blurYFilter: BlurFilterPass;
    private _strength: PointData;

    constructor(options?: BloomFilterOptions)
    {
        options = { ...BloomFilter.DEFAULT_OPTIONS, ...options };

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
}

