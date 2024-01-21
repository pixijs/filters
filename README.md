# PixiJS Filters

[![Node.js CI](https://github.com/pixijs/filters/workflows/Node.js%20CI/badge.svg)](https://github.com/pixijs/filters/actions/workflows/nodejs.yml?query=branch%3Amain) [![npm version](https://badge.fury.io/js/pixi-filters.svg)](https://www.npmjs.com/package/pixi-filters)

## Compatibility

Depending on your version of PixiJS, you'll need to figure out which major version of PixiJS Filters to use.

| PixiJS      | PixiJS Filters |
|-------------|----------------|
| v5.x        | v4.x           |
| v6.x - v7.x | v5.x           |
| v8.x        | v6.x           |

## Installation

Installation is available using NPM:

```bash
npm install pixi-filters
```

Alternatively, you can use a CDN such as JSDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/pixi-filters@latest/dist/browser/pixi-filters.min.js"></script>
```

If all else failes, you can manually download the bundled file from the [releases](https://github.com/pixijs/filters/releases) section and include it in your project.

## Demo

[View the PixiJS Filters Demo](https://pixijs.io/filters/examples/) to interactively play with filters to see how they work.

## Filters

| Filter                                                                                                   | Preview                                                                                                         |
|----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **AdjustmentFilter**<br>_pixi-filters/adjustment_<br>[View demo][Adjustment_demo]                        | ![adjustment](https://filters.pixijs.download/main/screenshots/adjustment.png?v=3)                   |
| **AdvancedBloomFilter**<br>_pixi-filters/advanced-bloom_<br>[View demo][AdvancedBloom_demo]              | ![advanced-bloom](https://filters.pixijs.download/main/screenshots/advanced-bloom.png?v=3)           |
| **AsciiFilter**<br>_pixi-filters/ascii_<br>[View demo][Ascii_demo]                                       | ![ascii](https://filters.pixijs.download/main/screenshots/ascii.png?v=3)                             |
| **BevelFilter**<br>_pixi-filters/bevel_<br>[View demo][Bevel_demo]                                       | ![bevel](https://filters.pixijs.download/main/screenshots/bevel.png?v=3)                             |
| **BloomFilter**<br>_pixi-filters/bloom_<br>[View demo][Bloom_demo]                                       | ![bloom](https://filters.pixijs.download/main/screenshots/bloom.png?v=3)                             |
| **BulgePinchFilter**<br>_pixi-filters/bulge-pinch_<br>[View demo][BulgePinch_demo]                       | ![bulge-pinch](https://filters.pixijs.download/main/screenshots/bulge-pinch.gif?v=3)                 |
| **ColorGradientFilter**<br>_pixi-filters/color-gradient_<br>[View demo][ColorGradient_demo]              | ![color-gradient](https://filters.pixijs.download/main/screenshots/color-gradient.png?v=3)           |
| **ColorMapFilter**<br>_pixi-filters/color-map_<br>[View demo][ColorMap_demo]                             | ![color-map](https://filters.pixijs.download/main/screenshots/color-map.png?v=3)                     |
| **ColorOverlayFilter**<br>_pixi-filters/color-overlay_<br>[View demo][ColorOverlay_demo]                 | ![color-overlay](https://filters.pixijs.download/main/screenshots/color-overlay.png?v=3)             |
| **ColorReplaceFilter**<br>_pixi-filters/color-replace_<br>[View demo][ColorReplace_demo]                 | ![color-replace](https://filters.pixijs.download/main/screenshots/color-replace.png?v=3)             |
| **ConvolutionFilter**<br>_pixi-filters/convolution_<br>[View demo][Convolution_demo]                     | ![convolution](https://filters.pixijs.download/main/screenshots/convolution.png?v=3)                 |
| **CrossHatchFilter**<br>_pixi-filters/cross-hatch_<br>[View demo][CrossHatch_demo]                       | ![cross-hatch](https://filters.pixijs.download/main/screenshots/cross-hatch.png?v=3)                 |
| **CRTFilter**<br>_pixi-filters/crt_<br>[View demo][CRT_demo]                                             | ![crt](https://filters.pixijs.download/main/screenshots/crt.png?v=3)                                 |
| **DotFilter**<br>_pixi-filters/dot_<br>[View demo][Dot_demo]                                             | ![dot](https://filters.pixijs.download/main/screenshots/dot.png?v=3)                                 |
| **DropShadowFilter**<br>_pixi-filters/drop-shadow_<br>[View demo][DropShadow_demo]                       | ![drop-shadow](https://filters.pixijs.download/main/screenshots/drop-shadow.png?v=3)                 |
| **EmbossFilter**<br>_pixi-filters/emboss_<br>[View demo][Emboss_demo]                                    | ![emboss](https://filters.pixijs.download/main/screenshots/emboss.png?v=3)                           |
| **GlitchFilter**<br>_pixi-filters/glitch_<br>[View demo][Glitch_demo]                                    | ![glitch](https://filters.pixijs.download/main/screenshots/glitch.png?v=1)                           |
| **GlowFilter**<br>_pixi-filters/glow_<br>[View demo][Glow_demo]                                          | ![glow](https://filters.pixijs.download/main/screenshots/glow.png?v=3)                               |
| **GodrayFilter**<br>_pixi-filters/godray_<br>[View demo][Godray_demo]                                    | ![godray](https://filters.pixijs.download/main/screenshots/godray.gif?v=3)                           |
| **GrayscaleFilter**<br>_pixi-filters/grayscale_<br>[View demo][Grayscale_demo]                           | ![grayscale](https://filters.pixijs.download/main/screenshots/grayscale.png?v=1)                     |
| **HslAdjustmentFilter**<br>_pixi-filters/hsl-adjustment_<br>[View demo][HslAdjustment_demo]              | ![hsl-adjustment](https://filters.pixijs.download/main/screenshots/hsl-adjustment.png?v=1)           |
| **KawaseBlurFilter**<br>_pixi-filters/kawase-blur_<br>[View demo][KawaseBlur_demo]                       | ![kawase-blur](https://filters.pixijs.download/main/screenshots/kawase-blur.png?v=1)                 |
| **MotionBlurFilter**<br>_pixi-filters/motion-blur_<br>[View demo][MotionBlur_demo]                       | ![motion-blur](https://filters.pixijs.download/main/screenshots/motion-blur.png?v=1)                 |
| **MultiColorReplaceFilter**<br>_pixi-filters/multi-color-replace_<br>[View demo][MultiColorReplace_demo] | ![multi-color-replace](https://filters.pixijs.download/main/screenshots/multi-color-replace.png?v=1) |
| **OldFilmFilter**<br>_pixi-filters/old-film_<br>[View demo][OldFilm_demo]                                | ![old-film](https://filters.pixijs.download/main/screenshots/old-film.gif?v=3)                       |
| **OutlineFilter**<br>_pixi-filters/outline_<br>[View demo][Outline_demo]                                 | ![outline](https://filters.pixijs.download/main/screenshots/outline.png?v=3)                         |
| **PixelateFilter**<br>_pixi-filters/pixelate_<br>[View demo][Pixelate_demo]                              | ![pixelate](https://filters.pixijs.download/main/screenshots/pixelate.png?v=3)                       |
| **RadialBlurFilter**<br>_pixi-filters/radial-blur_<br>[View demo][RadialBlur_demo]                       | ![radial-blur](https://filters.pixijs.download/main/screenshots/radial-blur.png?v=3)                 |
| **ReflectionFilter**<br>_pixi-filters/reflection_<br>[View demo][Reflection_demo]                        | ![reflection](https://filters.pixijs.download/main/screenshots/reflection.png?v=3)                   |
| **RGBSplitFilter**<br>_pixi-filters/rgb-split_<br>[View demo][RGBSplit_demo]                             | ![rgb split](https://filters.pixijs.download/main/screenshots/rgb.png?v=3)                           |                  |
| **ShockwaveFilter**<br>_pixi-filters/shockwave_<br>[View demo][Shockwave_demo]           | ![shockwave](https://filters.pixijs.download/main/screenshots/shockwave.gif?v=3)         |
| **SimpleLightmapFilter**<br>_pixi-filters/simple-lightmap_<br>[View demo][SimpleLightmap_demo]           | ![simple-lightmap](https://filters.pixijs.download/main/screenshots/simple-lightmap.png?v=3)         |
| **TiltShiftFilter**<br>_pixi-filters/tilt-shift_<br>[View demo][TiltShift_demo]                          | ![tilt-shift](https://filters.pixijs.download/main/screenshots/tilt-shift.png?v=3)                   |
| **TwistFilter**<br>_pixi-filters/twist_<br>[View demo][Twist_demo]                                       | ![twist](https://filters.pixijs.download/main/screenshots/twist.png?v=3)                             |
| **ZoomBlurFilter**<br>_pixi-filters/zoom-blur_<br>[View demo][ZoomBlur_demo]                             | ![zoom-blur](https://filters.pixijs.download/main/screenshots/zoom-blur.png?v=4)                     |

## Built-In Filters

PixiJS has a handful of core filters that are built-in to the PixiJS library.

| Filter                                                          | Preview                                                                                                                 |
|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **AlphaFilter**<br>[View demo][Alpha_demo]                      | ![alpha](https://filters.pixijs.download/main/screenshots/alpha.png?v=3)                                     |
| **BlurFilter**<br>[View demo][Blur_demo]                        | ![blur](https://filters.pixijs.download/main/screenshots/blur.png?v=3)                                       |
| **ColorMatrixFilter** (contrast)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-contrast](https://filters.pixijs.download/main/screenshots/color-matrix-contrast.png?v=3)     |
| **ColorMatrixFilter** (desaturate)<br>[View demo][ColorMatrix_demo] | ![color-matrix-desaturate](https://filters.pixijs.download/main/screenshots/color-matrix-desaturate.png?v=3) |
| **ColorMatrixFilter** (kodachrome)<br>[View demo][ColorMatrix_demo] | ![color-matrix-kodachrome](https://filters.pixijs.download/main/screenshots/color-matrix-kodachrome.png?v=3) |
| **ColorMatrixFilter** (lsd)<br>[View demo][ColorMatrix_demo]        | ![color-matrix-lsd](https://filters.pixijs.download/main/screenshots/color-matrix-lsd.png?v=3)               |
| **ColorMatrixFilter** (negative)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-negative](https://filters.pixijs.download/main/screenshots/color-matrix-negative.png?v=3)     |
| **ColorMatrixFilter** (polaroid)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-polaroid](https://filters.pixijs.download/main/screenshots/color-matrix-polaroid.png?v=3)     |
| **ColorMatrixFilter** (predator)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-predator](https://filters.pixijs.download/main/screenshots/color-matrix-predator.png?v=3)     |
| **ColorMatrixFilter** (saturate)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-saturate](https://filters.pixijs.download/main/screenshots/color-matrix-saturate.png?v=3)     |
| **ColorMatrixFilter** (sepia)<br>[View demo][ColorMatrix_demo]      | ![color-matrix-sepia](https://filters.pixijs.download/main/screenshots/color-matrix-sepia.png?v=3)           |
| **DisplacementFilter**<br>[View demo][Displacement_demo]        | ![displacement](https://filters.pixijs.download/main/screenshots/displacement.png?v=3)                       |
| **NoiseFilter**<br>[View demo][Noise_demo]                      | ![noise](https://filters.pixijs.download/main/screenshots/noise.png?v=3)                                     |

## Building

PixiJS Filters uses [Lerna](https://github.com/lerna/lerna) under-the-hood to build all of the filters separately. Install all dependencies by simply running the following.

```bash
npm install
```

Build all filters, demo and screenshots by running the following:

```bash
npm run build
```

Watch all filters and demo (auto-rebuild upon src changes):

```bash
npm run watch
```

## Documentation

API documention can be found [here](http://pixijs.io/filters/docs/).

<!-- references -->
[Adjustment_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=AdjustmentFilter
[AdvancedBloom_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=AdvancedBloomFilter
[Ascii_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=AsciiFilter
[Bevel_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=BevelFilter
[Bloom_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=BloomFilter
[BulgePinch_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=BulgePinchFilter
[ColorGradient_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ColorGradientFilter
[ColorMap_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ColorMapFilter
[ColorOverlay_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ColorOverlayFilter
[ColorReplace_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ColorReplaceFilter
[Convolution_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ConvolutionFilter
[CrossHatch_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=CrossHatchFilter
[CRT_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=CRTFilter
[Dot_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=DotFilter
[DropShadow_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=DropShadowFilter
[Emboss_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=EmbossFilter
[Glitch_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=GlitchFilter
[Glow_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=GlowFilter
[Godray_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=GodrayFilter
[Grayscale_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=GrayscaleFilter
[HslAdjustment_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=HslAdjustmentFilter
[KawaseBlur_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=KawaseBlurFilter
[MotionBlur_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=MotionBlurFilter
[MultiColorReplace_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=MultiColorReplaceFilter
[OldFilm_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=OldFilmFilter
[Outline_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=OutlineFilter
[Pixelate_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=PixelateFilter
[RadialBlur_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=RadialBlurFilter
[Reflection_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ReflectionFilter
[RGBSplit_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=RGBSplitFilter
[Shockwave_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ShockwaveFilter
[SimpleLightmap_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=SimpleLightmapFilter
[TiltShift_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=TiltShiftFilter
[Twist_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=TwistFilter
[ZoomBlur_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ZoomBlurFilter
[Alpha_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=AlphaFilter
[Blur_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=BlurFilter
[ColorMatrix_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=ColorMatrixFilter
[Displacement_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=DisplacementFilter
[Noise_demo]: https://filters.pixijs.download/main/examples/index.html?enabled=NoiseFilter
