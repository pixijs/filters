import {vertex} from '@tools/fragments';
import fragment from './old-film.frag';
import * as PIXI from 'pixi.js';

/**
 * The OldFilmFilter applies a Old film effect to an object.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/old-film.gif)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 *
 * @param {object|number} [options] - The optional parameters of old film effect.
 *                        When options is a number , it will be `seed`
 * @param {number} [options.sepia=0.3] - The amount of saturation of sepia effect,
 *        a value of `1` is more saturation and closer to `0` is less, and a value of
 *        `0` produces no sepia effect
 * @param {number} [options.noise=0.3] - Opacity/intensity of the noise effect between `0` and `1`
 * @param {number} [options.noiseSize=1.0] - The size of the noise particles
 * @param {number} [options.scratch=0.5] - How often scratches appear
 * @param {number} [options.scratchDensity=0.3] - The density of the number of scratches
 * @param {number} [options.scratchWidth=1.0] - The width of the scratches
 * @param {number} [options.vignetting=0.3] - The radius of the vignette effect, smaller
 *        values produces a smaller vignette
 * @param {number} [options.vignettingAlpha=1.0] - Amount of opacity of vignette
 * @param {number} [options.vignettingBlur=0.3] - Blur intensity of the vignette
 * @param {number} [seed=0] - A see value to apply to the random noise generation
 */
export default class OldFilmFilter extends PIXI.Filter {
    constructor(options, seed = 0) {
        super(vertex, fragment);
        this.uniforms.dimensions = new Float32Array(2);

        if (typeof options === 'number') {
            this.seed = options;
            options = null;
        }
        else {
            /**
             * A see value to apply to the random noise generation
             * @member {number}
             */
            this.seed = seed;
        }

        Object.assign(this, {
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
     * The amount of saturation of sepia effect,
     * a value of `1` is more saturation and closer to `0` is less,
     * and a value of `0` produces no sepia effect
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
     * Opacity/intensity of the noise effect between `0` and `1`
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
     * The size of the noise particles
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
     * How often scratches appear
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
     * The density of the number of scratches
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
     * The width of the scratches
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
     * The radius of the vignette effect, smaller
     * values produces a smaller vignette
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
     * Amount of opacity of vignette
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
     * Blur intensity of the vignette
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
