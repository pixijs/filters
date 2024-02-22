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
                    source: `
                    @group(0) @binding(1) var uTexture: texture_2d<f32>; 
                    @group(0) @binding(2) var uSampler: sampler;
                    @group(1) @binding(0) var uBackground: texture_2d<f32>; 

                    @fragment
                    fn mainFragment(
                        @builtin(position) position: vec4<f32>,
                        @location(0) uv : vec2<f32>
                    ) -> @location(0) vec4<f32> {
                        var front: vec4<f32> = textureSample(uTexture, uSampler, uv);
                        var back: vec4<f32> = textureSample(uBackground, uSampler, uv);
                        
                        if (front.a == 0.0) {
                            discard;
                        }

                        var color: vec3<f32> = mix(back.rgb, front.rgb / front.a, front.a);

                        return vec4<f32>(color, 1.0);
                    }
                    `,
                    entryPoint: 'mainFragment',
                },
            }),
            glProgram: GlProgram.from({
                vertex,
                fragment: `
                in vec2 vTextureCoord;
                out vec4 finalColor;
                uniform sampler2D uTexture;
                uniform sampler2D uBackground;

                void main(void){
                    vec4 front = texture(uTexture, vTextureCoord);
                    vec4 back = texture(uBackground, vTextureCoord);

                    if (front.a == 0.0) {
                        discard;
                    }
                    
                    vec3 color = mix(back.rgb, front.rgb / front.a, front.a);
                
                    finalColor = vec4(color, 1.0);
                }
                `,
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