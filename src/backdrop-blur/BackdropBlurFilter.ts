import {
    BlurFilter,
    BlurFilterOptions,
    Filter,
    FilterSystem,
    GlProgram,
    GpuProgram,
    RenderSurface,
    Texture,
    TexturePool,
} from 'pixi.js';
import { vertex, wgslVertex } from '../defaults';
import fragment from './backdrop-blur-blend.frag';
import wgslFragment from './backdrop-blur-blend.wgsl';

export type BackdropBlurFilterOptions = BlurFilterOptions;

/**
 * The BackdropBlurFilter applies a Gaussian blur to everything behind an object, and then draws the object on top of it.
 *
 * @class
 * @extends BlurFilter
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */
export class BackdropBlurFilter extends BlurFilter
{
    private _blendPass: Filter;

    /**
     * @param options - The options of the blur filter.
     * @param options.strength - The strength of the blur filter.
     * @param options.quality - The quality of the blur filter.
     * @param options.kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
     */
    constructor(options?: BackdropBlurFilterOptions)
    {
        super(options);

        this.blendRequired = true;
        this.padding = 0;

        this._blendPass = new Filter({
            gpuProgram: GpuProgram.from({
                vertex: {
                    source: wgslVertex,
                    entryPoint: 'mainVertex',
                },
                fragment: {
                    source: wgslFragment,
                    entryPoint: 'mainFragment',
                },
            }),
            glProgram: GlProgram.from({
                vertex,
                fragment,
                name: 'drop-shadow-filter',
            }),
            resources: {
                uBackground: Texture.EMPTY,
            },
        });
    }

    /**
     * Override existing apply method in `Filter`
     * @override
     * @ignore
     */
    public apply(
        filterManager: FilterSystem,
        input: Texture,
        output: RenderSurface,
        clearMode: boolean
    ): void
    {
        // @ts-expect-error - this should probably not be grabbed from a private property
        const backTexture = filterManager._activeFilterData.backTexture;

        const blurredBackground = TexturePool.getSameSizeTexture(input);

        super.apply(filterManager, backTexture, blurredBackground, true);

        this._blendPass.resources.uBackground = blurredBackground.source;
        this._blendPass.apply(filterManager, input, output, clearMode);

        TexturePool.returnTexture(blurredBackground);
    }

    protected updatePadding(): void
    {
        this.padding = 0;
    }
}
