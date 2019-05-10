import {vertex} from '@tools/fragments';
import fragment from './glitch.frag';
import {Filter, Texture} from '@pixi/core';
import {SCALE_MODES} from '@pixi/constants';
import {DEG_TO_RAD} from '@pixi/math';

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glitch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-glitch|@pixi/filter-glitch}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 * @param {object} [options] - The more optional parameters of the filter.
 * @param {number} [options.slices=5] - The maximum number of slices.
 * @param {number} [options.offset=100] - The maximum offset amount of slices.
 * @param {number} [options.direction=0] - The angle in degree of the offset of slices.
 * @param {number} [options.fillMode=0] - The fill mode of the space after the offset. Acceptable values:
 *  - `0` {@link PIXI.filters.GlitchFilter.TRANSPARENT TRANSPARENT}
 *  - `1` {@link PIXI.filters.GlitchFilter.ORIGINAL ORIGINAL}
 *  - `2` {@link PIXI.filters.GlitchFilter.LOOP LOOP}
 *  - `3` {@link PIXI.filters.GlitchFilter.CLAMP CLAMP}
 *  - `4` {@link PIXI.filters.GlitchFilter.MIRROR MIRROR}
 * @param {number} [options.seed=0] - A seed value for randomizing glitch effect.
 * @param {number} [options.average=false] - `true` will divide the bands roughly based on equal amounts
 *                 where as setting to `false` will vary the band sizes dramatically (more random looking).
 * @param {number} [options.minSize=8] - Minimum size of individual slice. Segment of total `sampleSize`
 * @param {number} [options.sampleSize=512] - The resolution of the displacement map texture.
 * @param {number} [options.red=[0,0]] - Red channel offset
 * @param {number} [options.green=[0,0]] - Green channel offset.
 * @param {number} [options.blue=[0,0]] - Blue channel offset.
 */
class GlitchFilter extends Filter {

    constructor(options = {}) {

        super(vertex, fragment);
        this.uniforms.dimensions = new Float32Array(2);

        options = Object.assign({
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
        }, options);

        this.direction = options.direction;
        this.red = options.red;
        this.green = options.green;
        this.blue = options.blue;

        /**
         * The maximum offset value for each of the slices.
         *
         * @member {number}
         */
        this.offset = options.offset;

        /**
         * The fill mode of the space after the offset.
         *
         * @member {number}
         */
        this.fillMode = options.fillMode;

        /**
         * `true` will divide the bands roughly based on equal amounts
         * where as setting to `false` will vary the band sizes dramatically (more random looking).
         *
         * @member {boolean}
         * @default false
         */
        this.average = options.average;

        /**
         * A seed value for randomizing color offset. Animating
         * this value to `Math.random()` produces a twitching effect.
         *
         * @member {number}
         */
        this.seed = options.seed;

        /**
         * Minimum size of slices as a portion of the `sampleSize`
         *
         * @member {number}
         */
        this.minSize = options.minSize;

        /**
         * Height of the displacement map canvas.
         *
         * @member {number}
         * @readonly
         */
        this.sampleSize = options.sampleSize;

        /**
         * Internally generated canvas.
         *
         * @member {HTMLCanvasElement} _canvas
         * @private
         */
        this._canvas = document.createElement('canvas');
        this._canvas.width = 4;
        this._canvas.height = this.sampleSize;

        /**
         * The displacement map is used to generate the bands.
         * If using your own texture, `slices` will be ignored.
         *
         * @member {PIXI.Texture}
         * @readonly
         */
        this.texture = Texture.from(this._canvas, { scaleMode: SCALE_MODES.NEAREST });

        /**
         * Internal number of slices
         * @member {number}
         * @private
         */
        this._slices = 0;

        // Set slices
        this.slices = options.slices;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {

        const width = input.filterFrame.width;
        const height = input.filterFrame.height;

        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;

        this.uniforms.seed = this.seed;
        this.uniforms.offset = this.offset;
        this.uniforms.fillMode = this.fillMode;

        filterManager.applyFilter(this, input, output, clear);
    }

    /**
     * Randomize the slices size (heights).
     *
     * @private
     */
    _randomizeSizes() {
        const arr = this._sizes;
        const last = this._slices - 1;
        const size = this.sampleSize;
        const min = Math.min(this.minSize / size, 0.9 / this._slices);

        if (this.average) {
            const count = this._slices;
            let rest = 1;

            for (let i = 0; i < last; i++) {
                const averageWidth = rest / (count - i);
                const w =  Math.max(averageWidth * (1 - Math.random() * 0.6), min);
                arr[i] = w;
                rest -= w;
            }
            arr[last] = rest;
        }
        else {
            let rest = 1;
            const ratio = Math.sqrt(1 / this._slices);

            for (let i = 0; i < last; i++) {
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
    shuffle() {
        const arr = this._sizes;
        const last = this._slices - 1;

        // shuffle
        for (let i = last; i > 0; i--) {
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
    _randomizeOffsets() {
        for (let i = 0 ; i < this._slices; i++) {
            this._offsets[i] = Math.random() * (Math.random() < 0.5 ? -1 : 1);
        }
    }

    /**
     * Regenerating random size, offsets for slices.
     */
    refresh() {
        this._randomizeSizes();
        this._randomizeOffsets();
        this.redraw();
    }

    /**
     * Redraw displacement bitmap texture, advanced usage.
     */
    redraw() {
        const size = this.sampleSize;
        const texture = this.texture;
        const ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, 8, size);

        let offset;
        let y = 0;

        for (let i = 0 ; i < this._slices; i++) {
            offset = Math.floor(this._offsets[i] * 256);
            const height = this._sizes[i] * size;
            const red = offset > 0 ? offset : 0;
            const green = offset < 0 ? -offset : 0;
            ctx.fillStyle = 'rgba(' + red + ', ' + green + ', 0, 1)';
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }

        texture.baseTexture.update();
        this.uniforms.displacementMap = texture;
    }

    /**
     * Manually custom slices size (height) of displacement bitmap
     *
     * @member {number[]}
     */
    set sizes(sizes) {
        const len = Math.min(this._slices, sizes.length);

        for (let i = 0; i < len; i++){
            this._sizes[i] = sizes[i];
        }
    }
    get sizes() {
        return this._sizes;
    }

    /**
     * Manually set custom slices offset of displacement bitmap, this is
     * a collection of values from -1 to 1. To change the max offset value
     * set `offset`.
     *
     * @member {number[]}
     */
    set offsets(offsets) {
        const len = Math.min(this._slices, offsets.length);

        for (let i = 0; i < len; i++){
            this._offsets[i] = offsets[i];
        }
    }
    get offsets() {
        return this._offsets;
    }

    /**
     * The count of slices.
     * @member {number}
     * @default 5
     */
    get slices() {
        return this._slices;
    }
    set slices(value) {
        if (this._slices === value) {
            return;
        }
        this._slices = value;
        this.uniforms.slices = value;
        this._sizes = this.uniforms.slicesWidth = new Float32Array(value);
        this._offsets = this.uniforms.slicesOffset = new Float32Array(value);
        this.refresh();
    }

    /**
     * The angle in degree of the offset of slices.
     * @member {number}
     * @default 0
     */
    get direction() {
        return this._direction;
    }
    set direction(value) {
        if (this._direction === value) {
            return;
        }
        this._direction = value;

        const radians = value * DEG_TO_RAD;

        this.uniforms.sinDir = Math.sin(radians);
        this.uniforms.cosDir = Math.cos(radians);
    }

    /**
     * Red channel offset.
     *
     * @member {PIXI.Point}
     */
    get red() {
        return this.uniforms.red;
    }
    set red(value) {
        this.uniforms.red = value;
    }

    /**
     * Green channel offset.
     *
     * @member {PIXI.Point}
     */
    get green() {
        return this.uniforms.green;
    }
    set green(value) {
        this.uniforms.green = value;
    }

    /**
     * Blue offset.
     *
     * @member {PIXI.Point}
     */
    get blue() {
        return this.uniforms.blue;
    }
    set blue(value) {
        this.uniforms.blue = value;
    }

    /**
     * Removes all references
     */
    destroy() {
        this.texture.destroy(true);
        this.texture = null;
        this._canvas = null;
        this.red = null;
        this.green = null;
        this.blue = null;
        this._sizes = null;
        this._offsets = null;
    }
}

/**
 * Fill mode as transparent
 *
 * @constant
 * @static
 * @member {int} TRANSPARENT
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.TRANSPARENT = 0;

/**
 * Fill mode as original
 *
 * @constant
 * @static
 * @member {int} ORIGINAL
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.ORIGINAL = 1;

/**
 * Fill mode as loop
 *
 * @constant
 * @static
 * @member {int} LOOP
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.LOOP = 2;

/**
 * Fill mode as clamp
 *
 * @constant
 * @static
 * @member {int} CLAMP
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.CLAMP = 3;

/**
 * Fill mode as mirror
 *
 * @constant
 * @static
 * @member {int} MIRROR
 * @memberof PIXI.filters.GlitchFilter
 * @readonly
 */
GlitchFilter.MIRROR = 4;

export { GlitchFilter };
