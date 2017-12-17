import {vertex} from '@tools/fragments';
import fragment from './old-film.frag';

/**
 * The OldFilmFilter applies a Old film effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/old-film.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of old film effect.
 *                        When options is a number , it will be `seed`.
 * @param {number} [options.sepia=0.3] - TODO
 * @param {number} [options.noise=0.3] - TODO
 * @param {number} [options.noiseSize=1.0] - TODO
 * @param {number} [options.scratch=0.5] - TODO
 * @param {number} [options.scratchDensity=0.3] - TODO
 * @param {number} [options.scratchWidth=1.0] - TODO
 * @param {number} [options.vignetting=0.3] - TODO
 * @param {number} [options.vignettingAlpha=1.0] - TODO
 * @param {number} [options.vignettingBlur=0.3] - TODO
 * @param {number} [seed=0.3] - TODO
 */
export default class OldFilmFilter extends PIXI.Filter {
    constructor(options, seed = 0.0) {
        super(vertex, fragment);

        if (typeof options === 'number') {
            this.seed = options;
            options = null;
        }
        else {
            this.seed = seed;
        }

        options = Object.assign({
            sepia: 0.3,
            noise: 0.3,
            noiseSize: 1.0,
            scratch: 0.5,
            scratchDensity: 0.3,
            scratchWidth: 1.0,
            vignetting: 0.3,
            vignettingAlpha: 1.0,
            vignettingBlur: 0.3,
        }, options);

        this.sepia = options.sepia;
        this.noise = options.noise;
        this.noiseSize = options.noiseSize;
        this.scratch = options.scratch;
        this.scratchDensity = options.scratchDensity;
        this.scratchWidth = options.scratchWidth;
        this.vignetting = options.vignetting;
        this.vignettingAlpha = options.vignettingAlpha;
        this.vignettingBlur = options.vignettingBlur;
    }

    /**
     * Override existing apply method in PIXI.Filter
     * @private
     */
    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.sourceFrame.width;
        this.uniforms.dimensions[1] = input.sourceFrame.height;

        // named `seed` because in the most programming languages,
        // `random` used for "the function for generating random value".
        this.uniforms.seed = this.seed;

        filterManager.applyFilter(this, input, output, clear);
    }


    /**
     * The sepia of the filter.
     *
     * @member {number}
     * @default 0
     */
    set sepia(value) {
        this.uniforms.sepia = value;
    }

    get sepia() {
        return this.uniforms.sepia;
    }

    /**
     * The noise of the filter.
     *
     * @member {number}
     * @default 0
     */
    set noise(value) {
        this.uniforms.noise = value;
    }

    get noise() {
        return this.uniforms.noise;
    }

    /**
     * The noiseSize of the filter.
     *
     * @member {number}
     * @default 0
     */
    set noiseSize(value) {
        this.uniforms.noiseSize = value;
    }

    get noiseSize() {
        return this.uniforms.noiseSize;
    }

    /**
     * The scratch of the filter.
     *
     * @member {number}
     * @default 0
     */
    set scratch(value) {
        this.uniforms.scratch = value;
    }

    get scratch() {
        return this.uniforms.scratch;
    }

    /**
     * The scratchDensity of the filter.
     *
     * @member {number}
     * @default 0
     */
    set scratchDensity(value) {
        this.uniforms.scratchDensity = value;
    }

    get scratchDensity() {
        return this.uniforms.scratchDensity;
    }

    /**
     * The scratchWidth of the filter.
     *
     * @member {number}
     * @default 0
     */
    set scratchWidth(value) {
        this.uniforms.scratchWidth = value;
    }

    get scratchWidth() {
        return this.uniforms.scratchWidth;
    }

    /**
     * The vignetting of the filter.
     *
     * @member {number}
     * @default 0
     */
    set vignetting(value) {
        this.uniforms.vignetting = value;
    }

    get vignetting() {
        return this.uniforms.vignetting;
    }

    /**
     * The vignettingAlpha of the filter.
     *
     * @member {number}
     * @default 0
     */
    set vignettingAlpha(value) {
        this.uniforms.vignettingAlpha = value;
    }

    get vignettingAlpha() {
        return this.uniforms.vignettingAlpha;
    }

    /**
     * The vignettingBlur of the filter.
     *
     * @member {number}
     * @default 0
     */
    set vignettingBlur(value) {
        this.uniforms.vignettingBlur = value;
    }

    get vignettingBlur() {
        return this.uniforms.vignettingBlur;
    }
}

// Export to PixiJS namespace
PIXI.filters.OldFilmFilter = OldFilmFilter;
