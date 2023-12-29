import { vertex } from '@tools/fragments';
import fragment from './glitch.frag';
import { Filter, Texture, DEG_TO_RAD, Rectangle, GlProgram } from 'pixi.js';
import type { FilterSystem, Point, RenderSurface, RenderTexture } from 'pixi.js';

type PointLike = Point | number[];

export interface GlitchFilterOptions
{
    slices: number;
    offset: number;
    direction: number;
    fillMode: number;
    seed: number;
    average: boolean;
    minSize: number;
    sampleSize: number;
    red: PointLike;
    green: PointLike;
    blue: PointLike;
}

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glitch.png)
 *
 * @class
 * @extends Filter
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glitch|@pixi/filter-glitch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class GlitchFilter extends Filter
{
    /** Default constructor options. */
    public static readonly defaults: GlitchFilterOptions = {
        slices: 5,
        offset: 100,
        direction: 0,
        fillMode: 0,
        average: false,
        seed: 0,
        red: [0, 0],
        green: [0, 0],
        blue: [0, 0],
        minSize: 8,
        sampleSize: 512,
    };

    /** Fill mode as transparent */
    static readonly TRANSPARENT = 0;

    /** Fill mode as original */
    static readonly ORIGINAL = 1;

    /** Fill mode as loop */
    static readonly LOOP = 2;

    /** Fill mode as clamp */
    static readonly CLAMP = 3;

    /** Fill mode as mirror */
    static readonly MIRROR = 4;

    /** The maximum offset value for each of the slices. */
    public offset = 100;

    /** The fill mode of the space after the offset. */
    public fillMode: number = GlitchFilter.TRANSPARENT;

    /**
     * `true` will divide the bands roughly based on equal amounts
     * where as setting to `false` will vary the band sizes dramatically (more random looking).
     */
    public average = false;

    /**
     * A seed value for randomizing color offset. Animating
     * this value to `Math.random()` produces a twitching effect.
     */
    public seed = 0;

    /** Minimum size of slices as a portion of the `sampleSize` */
    public minSize = 8;

    /** Height of the displacement map canvas. */
    public sampleSize = 512;

    /** Internally generated canvas. */
    private _canvas: HTMLCanvasElement;

    /**
     * The displacement map is used to generate the bands.
     * If using your own texture, `slices` will be ignored.
     *
     * @member {Texture}
     * @readonly
     */
    // public texture: Texture;

    /** Internal number of slices */
    private _slices = 0;

    private _offsets: Float32Array = new Float32Array(1);
    private _sizes: Float32Array = new Float32Array(1);

    /** direction is actually a setter for uniform.cosDir and uniform.sinDir.
     * Must be initialized to something different than the default value.
    */
    private _direction = -1;

    /**
     * @param {object} [options] - The more optional parameters of the filter.
     * @param {number} [options.slices=5] - The maximum number of slices.
     * @param {number} [options.offset=100] - The maximum offset amount of slices.
     * @param {number} [options.direction=0] - The angle in degree of the offset of slices.
     * @param {number} [options.fillMode=0] - The fill mode of the space after the offset. Acceptable values:
     *  - `0` {@link GlitchFilter.TRANSPARENT TRANSPARENT}
     *  - `1` {@link GlitchFilter.ORIGINAL ORIGINAL}
     *  - `2` {@link GlitchFilter.LOOP LOOP}
     *  - `3` {@link GlitchFilter.CLAMP CLAMP}
     *  - `4` {@link GlitchFilter.MIRROR MIRROR}
     * @param {number} [options.seed=0] - A seed value for randomizing glitch effect.
     * @param {boolean} [options.average=false] - `true` will divide the bands roughly based on equal amounts
     *                 where as setting to `false` will vary the band sizes dramatically (more random looking).
     * @param {number} [options.minSize=8] - Minimum size of individual slice. Segment of total `sampleSize`
     * @param {number} [options.sampleSize=512] - The resolution of the displacement map texture.
     * @param {number[]} [options.red=[0,0]] - Red channel offset
     * @param {number[]} [options.green=[0,0]] - Green channel offset.
     * @param {number[]} [options.blue=[0,0]] - Blue channel offset.
     */
    constructor(options?: Partial<GlitchFilterOptions>)
    {
        const glProgram = new GlProgram({
            vertex,
            fragment,
            name: 'glitch-filter',
        });

        super({
            glProgram,
            resources: {},
        });

        // this.uniforms.dimensions = new Float32Array(2);

        this._canvas = document.createElement('canvas');
        this._canvas.width = 4;
        this._canvas.height = this.sampleSize;
        // this.texture = Texture.from(this._canvas, { scaleMode: SCALE_MODES.NEAREST });

        Object.assign(this, GlitchFilter.defaults, options);
    }

    /**
     * Override existing apply method in Filter
     * @private
     */
    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clear: boolean): void
    {
        // const { width, height } = input.filterFrame as Rectangle;

        // this.uniforms.dimensions[0] = width;
        // this.uniforms.dimensions[1] = height;
        // this.uniforms.aspect = height / width;

        // this.uniforms.seed = this.seed;
        // this.uniforms.offset = this.offset;
        // this.uniforms.fillMode = this.fillMode;

        // filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Randomize the slices size (heights).
     *
     * @private
     */
    private _randomizeSizes()
    {
        const arr = this._sizes;
        const last = this._slices - 1;
        const size = this.sampleSize;
        const min = Math.min(this.minSize / size, 0.9 / this._slices);

        if (this.average)
        {
            const count = this._slices;
            let rest = 1;

            for (let i = 0; i < last; i++)
            {
                const averageWidth = rest / (count - i);
                const w =  Math.max(averageWidth * (1 - (Math.random() * 0.6)), min);

                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }
        else
        {
            let rest = 1;
            const ratio = Math.sqrt(1 / this._slices);

            for (let i = 0; i < last; i++)
            {
                const w = Math.max(ratio * rest * Math.random(), min);

                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }

        this.shuffle();
    }

    /**
     * Shuffle the sizes of the slices, advanced usage.
     */
    shuffle(): void
    {
        const arr = this._sizes;
        const last = this._slices - 1;

        // shuffle
        for (let i = last; i > 0; i--)
        {
            const rand = (Math.random() * i) >> 0;
            const temp = arr[i];

            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    }

    /**
     * Randomize the values for offset from -1 to 1
     *
     * @private
     */
    private _randomizeOffsets(): void
    {
        for (let i = 0; i < this._slices; i++)
        {
            this._offsets[i] = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        }
    }

    /**
     * Regenerating random size, offsets for slices.
     */
    refresh(): void
    {
        this._randomizeSizes();
        this._randomizeOffsets();
        this.redraw();
    }

    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    redraw(): void
    {
        const size = this.sampleSize;
        // const texture = this.texture;
        const ctx = this._canvas.getContext('2d') as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, 8, size);

        let offset;
        let y = 0;

        for (let i = 0; i < this._slices; i++)
        {
            offset = Math.floor(this._offsets[i] * 256);
            const height = this._sizes[i] * size;
            const red = offset > 0 ? offset : 0;
            const green = offset < 0 ? -offset : 0;

            ctx.fillStyle = `rgba(${red}, ${green}, 0, 1)`;
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }

        // texture.baseTexture.update();
        // this.uniforms.displacementMap = texture;
    }

    /**
     * Manually custom slices size (height) of displacement bitmap
     *
     * @member {number[]|Float32Array}
     */
    set sizes(sizes: Float32Array)
    {
        const len = Math.min(this._slices, sizes.length);

        for (let i = 0; i < len; i++)
        {
            this._sizes[i] = sizes[i];
        }
    }
    get sizes(): Float32Array
    {
        return this._sizes;
    }

    /**
     * Manually set custom slices offset of displacement bitmap, this is
     * a collection of values from -1 to 1. To change the max offset value
     * set `offset`.
     *
     * @member {number[]|Float32Array}
     */
    set offsets(offsets: Float32Array)
    {
        const len = Math.min(this._slices, offsets.length);

        for (let i = 0; i < len; i++)
        {
            this._offsets[i] = offsets[i];
        }
    }
    get offsets(): Float32Array
    {
        return this._offsets;
    }

    /**
     * The count of slices.
     * @default 5
     */
    // get slices(): number
    // {
    //     return this._slices;
    // }
    // set slices(value: number)
    // {
    //     if (this._slices === value)
    //     {
    //         return;
    //     }
    //     this._slices = value;
    //     this.uniforms.slices = value;
    //     this._sizes = this.uniforms.slicesWidth = new Float32Array(value);
    //     this._offsets = this.uniforms.slicesOffset = new Float32Array(value);
    //     this.refresh();
    // }

    /**
     * The angle in degree of the offset of slices.
     * @default 0
     */
    // get direction(): number
    // {
    //     return this._direction;
    // }
    // set direction(value: number)
    // {
    //     if (this._direction === value)
    //     {
    //         return;
    //     }
    //     this._direction = value;

    //     const radians = value * DEG_TO_RAD;

    //     this.uniforms.sinDir = Math.sin(radians);
    //     this.uniforms.cosDir = Math.cos(radians);
    // }

    /**
     * Red channel offset.
     *
     * @member {Point|number[]}
     */
    // get red(): PointLike
    // {
    //     return this.uniforms.red;
    // }
    // set red(value: PointLike)
    // {
    //     this.uniforms.red = value;
    // }

    /**
     * Green channel offset.
     *
     * @member {Point|number[]}
     */
    // get green(): PointLike
    // {
    //     return this.uniforms.green;
    // }
    // set green(value: PointLike)
    // {
    //     this.uniforms.green = value;
    // }

    /**
     * Blue offset.
     *
     * @member {Point|number[]}
     */
    // get blue(): PointLike
    // {
    //     return this.uniforms.blue;
    // }
    // set blue(value: PointLike)
    // {
    //     this.uniforms.blue = value;
    // }

    /**
     * Removes all references
     */
    destroy(): void
    {
        // this.texture?.destroy(true);
        // this.texture
        // = this._canvas
        // = this.red
        // = this.green
        // = this.blue
        // = this._sizes
        // = this._offsets = null as any;
    }
}
