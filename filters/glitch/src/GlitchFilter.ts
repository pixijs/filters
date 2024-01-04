import { vertex, wgslVertex } from '@tools/fragments';
import fragment from './glitch.frag';
import source from './glitch.wgsl';
import { Filter, Texture, DEG_TO_RAD, GlProgram, GpuProgram, getCanvasTexture } from 'pixi.js';
import type { FilterSystem, PointData, RenderSurface } from 'pixi.js';

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

enum FILL_MODES
    {
    TRANSPARENT = 0,
    ORIGINAL = 1,
    LOOP = 2,
    CLAMP = 3,
    MIRROR = 4,
}

export interface GlitchFilterOptions
{
    slices?: number;
    offset?: number;
    direction?: number;
    fillMode?: number;
    seed?: number;
    average?: boolean;
    minSize?: number;
    sampleSize?: number;
    red?: PointData;
    green?: PointData;
    blue?: PointData;
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
        red: { x: 0, y: 0 },
        green: { x: 0, y: 0 },
        blue: { x: 0, y: 0 },
        minSize: 8,
        sampleSize: 512,
    };

    public uniforms: {
        uSeed: number
        uDimensions: PointData,
        uAspect: number,
        uFillMode: number,
        uOffset: number,
        uDirection: number,
        uRed: PointData,
        uGreen: PointData,
        uBlue: PointData,
    };

    /**
     * `true` will divide the bands roughly based on equal amounts
     * where as setting to `false` will vary the band sizes dramatically (more random looking).
     */
    public average = false;

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
    public texture: Texture;

    /** Internal number of slices */
    private _slices = 0;

    private _sizes: Float32Array = new Float32Array(1);
    private _offsets: Float32Array = new Float32Array(1);

    constructor(options?: GlitchFilterOptions)
    {
        options = { ...GlitchFilter.defaults, ...options };

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
            name: 'glitch-filter',
        });

        super({
            gpuProgram,
            glProgram,
            resources: {
                glitchUniforms: {
                    uSeed: { value: options?.seed ?? 0, type: 'f32' },
                    uDimensions: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uAspect: { value: 1, type: 'f32' },
                    uFillMode: { value: options?.fillMode ?? 0, type: 'u32' },
                    uOffset: { value: options?.offset ?? 100, type: 'f32' },
                    uDirection: { value: options?.direction ?? 0, type: 'f32' },
                    uRed: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uGreen: { value: new Float32Array(2), type: 'vec2<f32>' },
                    uBlue: { value: new Float32Array(2), type: 'vec2<f32>' },
                },
                uDisplacementMap: Texture.WHITE,
            },
        });

        this.uniforms = this.resources.glitchUniforms.uniforms;

        this._canvas = document.createElement('canvas');
        this._canvas.width = 4;
        this._canvas.height = this.sampleSize;
        this.texture = getCanvasTexture(this._canvas, { style: { scaleMode: 'nearest' } });

        Object.assign(this, options);
    }

    /**
     * Override existing apply method in Filter
     * @private
     */
    apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        const { width, height } = input.frame;

        this.uniforms.uDimensions.x = width;
        this.uniforms.uDimensions.y = height;
        this.uniforms.uAspect = height / width;

        filterManager.applyFilter(this, input, output, clearMode);
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
        const texture = this.texture;
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

        texture.source.update();
        this.resources.uDisplacementMap = texture;
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
    get offsets(): Float32Array { return this._offsets; }

    /**
     * The count of slices.
     * @default 5
     */
    get slices(): number { return this._slices; }
    set slices(value: number)
    {
        if (this._slices === value) return;
        this._slices = value;
        this._sizes = new Float32Array(value);
        this._offsets = new Float32Array(value);
        this.refresh();
    }

    /**
     * The maximum offset amount of slices.
     * @default 100
     */
    get offset(): number { return this.uniforms.uOffset; }
    set offset(value: number) { this.uniforms.uOffset = value; }

    /**
     * A seed value for randomizing glitch effect.
     * @default 0
     */
    get seed(): number { return this.uniforms.uSeed; }
    set seed(value: number) { this.uniforms.uSeed = value; }

    /**
     * The fill mode of the space after the offset.
     * @default FILL_MODES.TRANSPARENT
     */
    get fillMode(): FILL_MODES { return this.uniforms.uFillMode; }
    set fillMode(value: FILL_MODES) { this.uniforms.uFillMode = value; }

    /**
     * The angle in degree of the offset of slices.
     * @default 0
     */
    get direction(): number { return this.uniforms.uDirection / DEG_TO_RAD; }
    set direction(value: number) { this.uniforms.uDirection = value * DEG_TO_RAD; }

    /**
     * Red channel offset.
     * @default {x:0,y:0}
     */
    get red(): PointData { return this.uniforms.uRed; }
    set red(value: PointData) { this.uniforms.uRed = value; }

    /**
     * Green channel offset.
     * @default {x:0,y:0}
     */
    get green(): PointData { return this.uniforms.uGreen; }
    set green(value: PointData) { this.uniforms.uGreen = value; }

    /**
     * Blue offset.
     * @default {x:0,y:0}
     */
    get blue(): PointData { return this.uniforms.uBlue; }
    set blue(value: PointData) { this.uniforms.uBlue = value; }

    /**
     * Removes all references
     */
    destroy(): void
    {
        this.texture?.destroy(true);
        this.texture
        = this._canvas
        = this.red
        = this.green
        = this.blue
        = this._sizes
        = this._offsets = null as any;
    }
}
