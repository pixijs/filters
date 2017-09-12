# PixiJS Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters)

## Filters

All filters work with PixiJS v4.

| Filter | Package | Preview |
|---|---|---|
| **AsciiFilter** | _@pixi/filter-ascii_ | ![ascii](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/ascii.png) |
| **BloomFilter** | _@pixi/filter-bloom_ | ![bloom](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/bloom.png) |
| **BulgePinchFilter** | _@pixi/filter-bulge-pinch_ | ![bulge-pinch](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/bulge-pinch.gif) |
| **ColorReplaceFilter** | _@pixi/filter-color-replace_ | ![color-replace](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-replace.png) |
| **ConvolutionFilter** | _@pixi/filter-convolution_ | ![convolution](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/convolution.png) |
| **CrossHatchFilter** | _@pixi/filter-cross-hatch_ | ![cross-hatch](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/cross-hatch.png) |
| **DotFilter** | _@pixi/filter-dot_ | ![dot](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/dot.png) |
| **DropShadowFilter** | _@pixi/filter-drop-shadow_| ![drop-shadow](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/drop-shadow.png) |
| **GlowFilter** | _@pixi/filter-glow_ | ![glow](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/glow.png) |
| **EmbossFilter** | _@pixi/filter-emboss_ | ![emboss](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/emboss.png) |
| **PixelateFilter** | _@pixi/filter-pixelate_ | ![pixelate](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/pixelate.png) |
| **OutlineFilter** | _@pixi/filter-outline_ | ![outline](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/outline.png) |
| **RGBSplitFilter** | _@pixi/filter-rgb_ | ![rgb split](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/rgb.png) |
| **ShockwaveFilter** | _@pixi/filter-shockwave_ | ![shockwave](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/shockwave.gif) |
| **SimpleLightmapFilter** | _@pixi/filter-simple-lightmap_ | ![simple-lightmap](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/simple-lightmap.png) |
| **TiltShiftFilter** | _@pixi/filter-tilt-shift_ | ![tilt-shift](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/tilt-shift.png) |
| **TwistFilter** | _@pixi/filter-twist_ | ![twist](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/twist.png) |

## Build-In Filters

PixiJS has a handful of core filters that are built-in to the PixiJS library.

| Filter | Preview |
|---|---|
| **DisplacementFilter** | ![displacement](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/displacement.png) |
| **BlurFilter** | ![blur](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/blur.png) |
| **NoiseFilter** | ![noise](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/noise.png) |
| **ColorMatrixFilter** (contrast) | ![color-matrix-contrast](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-contrast.png) |
| **ColorMatrixFilter** (desaturate) | ![color-matrix-desaturate](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-desaturate.png) |
| **ColorMatrixFilter** (kodachrome) | ![color-matrix-kodachrome](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-kodachrome.png) |
| **ColorMatrixFilter** (lsd) | ![color-matrix-lsd](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-lsd.png) |
| **ColorMatrixFilter** (negative) | ![color-matrix-negative](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-negative.png) |
| **ColorMatrixFilter** (polaroid) | ![color-matrix-polaroid](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-polaroid.png) |
| **ColorMatrixFilter** (predator) | ![color-matrix-predator](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-predator.png) |
| **ColorMatrixFilter** (saturate) | ![color-matrix-saturate](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-saturate.png) |
| **ColorMatrixFilter** (sepia) | ![color-matrix-sepia](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-sepia.png) |

## Examples

Click [here](https://pixijs.github.io/pixi-filters/examples) for filter demos.

## Installation

Using NPM:

```bash
npm install pixi-filters
```

## Building

PixiJS Filter uses [Lerna](https://github.com/lerna/lerna) to build all of the filter separately. Install all dependencies by running the following. Note, it's not required to `npm install`.

```bash
npm run bootstrap
```

Build all filters by running the following:

```bash
npm run build
```

Build single filter by running the following:

```bash
npm run build -- --scope "@pixi/filter-emboss"
```

Build multiple filters where scope is a glob expression:

```bash
npm run build -- --scope "{@pixi/filter-emboss,@pixi/filter-glow}"
```

## Documentation

API documention can be found [here](http://pixijs.github.io/pixi-filters/docs/).
