# PixiJS Filters

[![Node.js CI](https://github.com/pixijs/filters/workflows/Node.js%20CI/badge.svg)](https://github.com/pixijs/filters/actions/workflows/nodejs.yml?query=branch%3Amain) [![npm version](https://badge.fury.io/js/pixi-filters.svg)](https://www.npmjs.com/package/pixi-filters)

## Demo

[View the PixiJS Filters Demo](https://pixijs.io/filters/tools/demo/) to interactively play with filters to see how they work.

## Filters

All filters work with PixiJS v7.

| Filter                                                                                                   | Preview                                                                                                         |
|----------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| **AdjustmentFilter**<br>_@pixi/filter-adjustment_<br>[View demo][Adjustment_demo]                        | ![adjustment](https://filters.pixijs.download/main/tools/screenshots/dist/adjustment.png?v=2)                   |
| **AdvancedBloomFilter**<br>_@pixi/filter-advanced-bloom_<br>[View demo][AdvancedBloom_demo]              | ![advanced-bloom](https://filters.pixijs.download/main/tools/screenshots/dist/advanced-bloom.png?v=2)           |
| **AsciiFilter**<br>_@pixi/filter-ascii_<br>[View demo][Ascii_demo]                                       | ![ascii](https://filters.pixijs.download/main/tools/screenshots/dist/ascii.png?v=2)                             |
| **BevelFilter**<br>_@pixi/filter-bevel_<br>[View demo][Bevel_demo]                                       | ![bevel](https://filters.pixijs.download/main/tools/screenshots/dist/bevel.png?v=2)                             |
| **BloomFilter**<br>_@pixi/filter-bloom_<br>[View demo][Bloom_demo]                                       | ![bloom](https://filters.pixijs.download/main/tools/screenshots/dist/bloom.png?v=2)                             |
| **BulgePinchFilter**<br>_@pixi/filter-bulge-pinch_<br>[View demo][BulgePinch_demo]                       | ![bulge-pinch](https://filters.pixijs.download/main/tools/screenshots/dist/bulge-pinch.gif?v=2)                 |
| **ColorGradientFilter**<br>_@pixi/filter-color-gradient_<br>[View demo][ColorGradient_demo]              | ![color-gradient](https://filters.pixijs.download/main/tools/screenshots/dist/color-gradient.png?v=2)           |
| **ColorMapFilter**<br>_@pixi/filter-color-map_<br>[View demo][ColorMap_demo]                             | ![color-map](https://filters.pixijs.download/main/tools/screenshots/dist/color-map.png?v=2)                     |
| **ColorOverlayFilter**<br>_@pixi/filter-color-overlay_<br>[View demo][ColorOverlay_demo]                 | ![color-overlay](https://filters.pixijs.download/main/tools/screenshots/dist/color-overlay.png?v=2)             |
| **ColorReplaceFilter**<br>_@pixi/filter-color-replace_<br>[View demo][ColorReplace_demo]                 | ![color-replace](https://filters.pixijs.download/main/tools/screenshots/dist/color-replace.png?v=2)             |
| **ConvolutionFilter**<br>_@pixi/filter-convolution_<br>[View demo][Convolution_demo]                     | ![convolution](https://filters.pixijs.download/main/tools/screenshots/dist/convolution.png?v=2)                 |
| **CrossHatchFilter**<br>_@pixi/filter-cross-hatch_<br>[View demo][CrossHatch_demo]                       | ![cross-hatch](https://filters.pixijs.download/main/tools/screenshots/dist/cross-hatch.png?v=2)                 |
| **CRTFilter**<br>_@pixi/filter-crt_<br>[View demo][CRT_demo]                                             | ![crt](https://filters.pixijs.download/main/tools/screenshots/dist/crt.png?v=2)                                 |
| **DotFilter**<br>_@pixi/filter-dot_<br>[View demo][Dot_demo]                                             | ![dot](https://filters.pixijs.download/main/tools/screenshots/dist/dot.png?v=2)                                 |
| **DropShadowFilter**<br>_@pixi/filter-drop-shadow_<br>[View demo][DropShadow_demo]                       | ![drop-shadow](https://filters.pixijs.download/main/tools/screenshots/dist/drop-shadow.png?v=2)                 |
| **EmbossFilter**<br>_@pixi/filter-emboss_<br>[View demo][Emboss_demo]                                    | ![emboss](https://filters.pixijs.download/main/tools/screenshots/dist/emboss.png?v=2)                           |
| **GlitchFilter**<br>_@pixi/filter-glitch_<br>[View demo][Glitch_demo]                                    | ![glitch](https://filters.pixijs.download/main/tools/screenshots/dist/glitch.png?v=1)                           |
| **GlowFilter**<br>_@pixi/filter-glow_<br>[View demo][Glow_demo]                                          | ![glow](https://filters.pixijs.download/main/tools/screenshots/dist/glow.png?v=2)                               |
| **GodrayFilter**<br>_@pixi/filter-godray_<br>[View demo][Godray_demo]                                    | ![godray](https://filters.pixijs.download/main/tools/screenshots/dist/godray.gif?v=2)                           |
| **GrayscaleFilter**<br>_@pixi/filter-grayscale_<br>[View demo][Grayscale_demo]                           | ![grayscale](https://filters.pixijs.download/main/tools/screenshots/dist/grayscale.png?v=1)                     |
| **HslAdjustmentFilter**<br>_@pixi/filter-hsl-adjustment_<br>[View demo][HslAdjustment_demo]              | ![hsl-adjustment](https://filters.pixijs.download/main/tools/screenshots/dist/hsl-adjustment.png?v=1)           |
| **KawaseBlurFilter**<br>_@pixi/filter-kawase-blur_<br>[View demo][KawaseBlur_demo]                       | ![kawase-blur](https://filters.pixijs.download/main/tools/screenshots/dist/kawase-blur.png?v=1)                 |
| **MotionBlurFilter**<br>_@pixi/filter-motion-blur_<br>[View demo][MotionBlur_demo]                       | ![motion-blur](https://filters.pixijs.download/main/tools/screenshots/dist/motion-blur.png?v=1)                 |
| **MultiColorReplaceFilter**<br>_@pixi/filter-multi-color-replace_<br>[View demo][MultiColorReplace_demo] | ![multi-color-replace](https://filters.pixijs.download/main/tools/screenshots/dist/multi-color-replace.png?v=1) |
| **OldFilmFilter**<br>_@pixi/filter-old-film_<br>[View demo][OldFilm_demo]                                | ![old-film](https://filters.pixijs.download/main/tools/screenshots/dist/old-film.gif?v=2)                       |
| **OutlineFilter**<br>_@pixi/filter-outline_<br>[View demo][Outline_demo]                                 | ![outline](https://filters.pixijs.download/main/tools/screenshots/dist/outline.png?v=2)                         |
| **PixelateFilter**<br>_@pixi/filter-pixelate_<br>[View demo][Pixelate_demo]                              | ![pixelate](https://filters.pixijs.download/main/tools/screenshots/dist/pixelate.png?v=2)                       |
| **RadialBlurFilter**<br>_@pixi/filter-radial-blur_<br>[View demo][RadialBlur_demo]                       | ![radial-blur](https://filters.pixijs.download/main/tools/screenshots/dist/radial-blur.png?v=2)                 |
| **ReflectionFilter**<br>_@pixi/filter-reflection_<br>[View demo][Reflection_demo]                        | ![reflection](https://filters.pixijs.download/main/tools/screenshots/dist/reflection.png?v=2)                   |
| **RGBSplitFilter**<br>_@pixi/filter-rgb-split_<br>[View demo][RGBSplit_demo]                             | ![rgb split](https://filters.pixijs.download/main/tools/screenshots/dist/rgb.png?v=2)                           |                  |
| **SimpleLightmapFilter**<br>_@pixi/filter-simple-lightmap_<br>[View demo][SimpleLightmap_demo]           | ![simple-lightmap](https://filters.pixijs.download/main/tools/screenshots/dist/simple-lightmap.png?v=2)         |
| **TiltShiftFilter**<br>_@pixi/filter-tilt-shift_<br>[View demo][TiltShift_demo]                          | ![tilt-shift](https://filters.pixijs.download/main/tools/screenshots/dist/tilt-shift.png?v=2)                   |
| **TwistFilter**<br>_@pixi/filter-twist_<br>[View demo][Twist_demo]                                       | ![twist](https://filters.pixijs.download/main/tools/screenshots/dist/twist.png?v=2)                             |
| **ZoomBlurFilter**<br>_@pixi/filter-zoom-blur_<br>[View demo][ZoomBlur_demo]                             | ![zoom-blur](https://filters.pixijs.download/main/tools/screenshots/dist/zoom-blur.png?v=4)                     |

## Built-In Filters

PixiJS has a handful of core filters that are built-in to the PixiJS library.

| Filter                                                          | Preview                                                                                                                 |
|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
| **AlphaFilter**<br>[View demo][Alpha_demo]                      | ![alpha](https://filters.pixijs.download/main/tools/screenshots/dist/alpha.png?v=2)                                     |
| **BlurFilter**<br>[View demo][Blur_demo]                        | ![blur](https://filters.pixijs.download/main/tools/screenshots/dist/blur.png?v=2)                                       |
| **ColorMatrixFilter** (contrast)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-contrast](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-contrast.png?v=2)     |
| **ColorMatrixFilter** (desaturate)<br>[View demo][ColorMatrix_demo] | ![color-matrix-desaturate](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-desaturate.png?v=2) |
| **ColorMatrixFilter** (kodachrome)<br>[View demo][ColorMatrix_demo] | ![color-matrix-kodachrome](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-kodachrome.png?v=2) |
| **ColorMatrixFilter** (lsd)<br>[View demo][ColorMatrix_demo]        | ![color-matrix-lsd](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-lsd.png?v=2)               |
| **ColorMatrixFilter** (negative)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-negative](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-negative.png?v=2)     |
| **ColorMatrixFilter** (polaroid)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-polaroid](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-polaroid.png?v=2)     |
| **ColorMatrixFilter** (predator)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-predator](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-predator.png?v=2)     |
| **ColorMatrixFilter** (saturate)<br>[View demo][ColorMatrix_demo]   | ![color-matrix-saturate](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-saturate.png?v=2)     |
| **ColorMatrixFilter** (sepia)<br>[View demo][ColorMatrix_demo]      | ![color-matrix-sepia](https://filters.pixijs.download/main/tools/screenshots/dist/color-matrix-sepia.png?v=2)           |
| **DisplacementFilter**<br>[View demo][Displacement_demo]        | ![displacement](https://filters.pixijs.download/main/tools/screenshots/dist/displacement.png?v=2)                       |
| **NoiseFilter**<br>[View demo][Noise_demo]                      | ![noise](https://filters.pixijs.download/main/tools/screenshots/dist/noise.png?v=2)                                     |

## Installation

Installation is available using NPM:

```bash
npm install pixi-filters
```

Alternatively, you can use a CDN such as JSDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/pixi-filters@latest/dist/pixi-filters.js"></script>
```

If all else failes, you can manually download the bundled file from the [releases](https://github.com/pixijs/filters/releases) section and include it in your project.

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
[Adjustment_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=AdjustmentFilter
[AdvancedBloom_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=AdvancedBloomFilter
[Ascii_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=AsciiFilter
[Bevel_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=BevelFilter
[Bloom_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=BloomFilter
[BulgePinch_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=BulgePinchFilter
[ColorGradient_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ColorGradientFilter
[ColorMap_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ColorMapFilter
[ColorOverlay_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ColorOverlayFilter
[ColorReplace_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ColorReplaceFilter
[Convolution_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ConvolutionFilter
[CrossHatch_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=CrossHatchFilter
[CRT_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=CRTFilter
[Dot_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=DotFilter
[DropShadow_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=DropShadowFilter
[Emboss_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=EmbossFilter
[Glitch_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=GlitchFilter
[Glow_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=GlowFilter
[Godray_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=GodrayFilter
[Grayscale_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=GrayscaleFilter
[HslAdjustment_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=HslAdjustmentFilter
[KawaseBlur_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=KawaseBlurFilter
[MotionBlur_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=MotionBlurFilter
[MultiColorReplace_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=MultiColorReplaceFilter
[OldFilm_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=OldFilmFilter
[Outline_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=OutlineFilter
[Pixelate_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=PixelateFilter
[RadialBlur_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=RadialBlurFilter
[Reflection_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ReflectionFilter
[RGBSplit_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=RGBSplitFilter
[SimpleLightmap_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=SimpleLightmapFilter
[TiltShift_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=TiltShiftFilter
[Twist_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=TwistFilter
[ZoomBlur_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ZoomBlurFilter
[Alpha_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=AlphaFilter
[Blur_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=BlurFilter
[ColorMatrix_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=ColorMatrixFilter
[Displacement_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=DisplacementFilter
[Noise_demo]: https://filters.pixijs.download/main/demo/index.html?enabled=NoiseFilter
