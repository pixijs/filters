import {vertex} from '@tools/fragments';
import fragment from './glitch.frag';

/**
 * The GlitchFilter applies a glitch effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/glitch.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @param {number} slices - The count of slices.
 * @param {number} offset - The max-offset of slices.
 * @param {number} direction - The angle in degree of the offset of slices.
 * @param {object} options - The more optional parameters of the filter.
 * @param {number} [options.fillMode=0] - The fill mode of the space after the offset.
 *                 0: TRANSPARENT; 1: ORIGINAL; 2: LOOP; 3: MIRROR.
 * @param {number} [options.red=[0,0]] - Red channel offset
 * @param {number} [options.green=[0,0]] - Green channel offset.
 * @param {number} [options.blue=[0,0]] - Blue channel offset.
 */
export default class GlitchFilter extends PIXI.Filter {
    constructor(slices = 5, offset = 100, direction = 0, options = {}) {

        super(vertex, fragment);

        Object.assign(this, {
            fillMode: 0,
            average: false,
            seed: 0.5,
            red: [0, 0],
            green: [0, 0],
            blue: [0, 0],
            minSliceWidth: 8,
            displacementMapSize: 512,
            displacementMap: null,
        }, options);

        this.offset = offset;
        this.direction = direction;

        if (!this.displacementMap) {
            this.displacementMapCanvas = document.createElement('canvas');
            this.displacementMapCanvas.width = 8;
            this.displacementMapCanvas.height = this.displacementMapSize;
            this.displacementMap = PIXI.Texture.fromCanvas(this.displacementMapCanvas, PIXI.SCALE_MODES.NEAREST);

            this._slices = 0;
            this.slices = slices;
        }
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {

        const width = input.sourceFrame.width;
        const height = input.sourceFrame.height;

        this.uniforms.dimensions[0] = width;
        this.uniforms.dimensions[1] = height;
        this.uniforms.aspect = height / width;

        this.uniforms.seed = this.seed;
        this.uniforms.offset = this.offset;
        this.uniforms.fillMode = this.fillMode;

        filterManager.applyFilter(this, input, output, clear);
    }

    initSlicesWidth(average) {
        this.average = average === undefined ? this.average : (average || false);

        const arr = this.slicesWidth;
        const last = this._slices - 1;
        const size = this.displacementMapSize;
        const min = Math.min(this.minSliceWidth / size, 0.9 / this._slices);

        if (this.average) {
            const count = this._slices;
            let rest = 1;

            for (let i = 0; i < last; i++) {
                const average = rest / (count - i);
                const v =  Math.max(average * (1 - Math.random() * 0.6), min);
                arr[i] = v;
                rest -= v;
            }
            arr[last] = rest;
        }
        else {
            let rest = 1;
            const ratio = Math.sqrt(1 / this._slices);

            for (let i = 0; i < last; i++) {
                const v = Math.max(ratio * rest * Math.random(), min);
                arr[i] = v;
                rest -= v;
            }
            arr[last] = rest;
        }

        this.shuffle();
    }

    initSlicesOffset() {
        for (let i = 0 ; i < this._slices; i++) {
            this.slicesOffset[i] = Math.floor(Math.random() * (Math.random() < 0.5 ? -256 : 256));
        }
    }

    shuffle() {
        const arr = this.slicesWidth;

        for (let i = this._slices - 1; i > 0; i--) {
            const rand = (Math.random() * i) >> 0;
            const temp = arr[i];

            arr[i] = arr[rand];
            arr[rand] = temp;
        }
    }

    refresh() {
        this.slicesWidth = new Float32Array(this._slices);
        this.initSlicesWidth(this.average);
        this.uniforms.slicesWidth = this.slicesWidth;

        this.slicesOffset = new Float32Array(this._slices);
        this.initSlicesOffset();
        this.uniforms.slicesOffset = this.slicesOffset;

        this.updateDisplacementMap();
    }

    updateDisplacementMap() {
        let canvas = this.displacementMapCanvas;
        let size = this.displacementMapSize;

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 8, size);

        let offset;
        let y = 0;
        for (let i = 0 ; i < this._slices; i++) {
            offset = this.slicesOffset[i];
            const height = this.slicesWidth[i] * size;
            const red = offset > 0 ? offset : 0;
            const green = offset < 0 ? -offset : 0;
            ctx.fillStyle = 'rgba(' + red + ', ' + green + ', 0, 1)';
            ctx.fillRect(0, y >> 0, size, height + 1 >> 0);
            y += height;
        }

        this.displacementMap._updateID++;
        this.displacementMap.baseTexture.emit('update', this.displacementMap.baseTexture);
        // this.displacementMap.update();
        this.uniforms.displacementMap = this.displacementMap;
    }

    setSlicesWidth(slicesWidth) {
        const len = Math.min(this._slices, slicesWidth.length);

        for (let i = 0; i < len; i++){
            this.slicesWidth[i] = slicesWidth[i];
        }
    }

    setSlicesOffset(slicesOffset) {
        const len = Math.min(this._slices, slicesOffset.length);

        for (let i = 0; i < len; i++){
            this.slicesOffset[i] = slicesOffset[i];
        }
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

        const radians = value * PIXI.DEG_TO_RAD;

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
}

// Export to PixiJS namespace
PIXI.filters.GlitchFilter = GlitchFilter;
