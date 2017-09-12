# PixiJS Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters)

## Filters

All filters work with PixiJS v4.

| Filter | Package | Preview |
|---|---|---|
| **AsciiFilter** | _@pixi/filter-ascii_ | ![ascii](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/ascii.png?v=2) |
| **BloomFilter** | _@pixi/filter-bloom_ | ![bloom](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/bloom.png?v=2) |
| **BulgePinchFilter** | _@pixi/filter-bulge-pinch_ | ![bulge-pinch](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/bulge-pinch.gif?v=2) |
| **ColorReplaceFilter** | _@pixi/filter-color-replace_ | ![color-replace](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-replace.png?v=2) |
| **ConvolutionFilter** | _@pixi/filter-convolution_ | ![convolution](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/convolution.png?v=2) |
| **CrossHatchFilter** | _@pixi/filter-cross-hatch_ | ![cross-hatch](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/cross-hatch.png?v=2) |
| **DotFilter** | _@pixi/filter-dot_ | ![dot](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/dot.png?v=2) |
| **DropShadowFilter** | _@pixi/filter-drop-shadow_| ![drop-shadow](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/drop-shadow.png?v=2) |
| **GlowFilter** | _@pixi/filter-glow_ | ![glow](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/glow.png?v=2) |
| **EmbossFilter** | _@pixi/filter-emboss_ | ![emboss](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/emboss.png?v=2) |
| **PixelateFilter** | _@pixi/filter-pixelate_ | ![pixelate](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/pixelate.png?v=2) |
| **OutlineFilter** | _@pixi/filter-outline_ | ![outline](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/outline.png?v=2) |
| **RGBSplitFilter** | _@pixi/filter-rgb_ | ![rgb split](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/rgb.png?v=2) |
| **ShockwaveFilter** | _@pixi/filter-shockwave_ | ![shockwave](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/shockwave.gif?v=2) |
| **SimpleLightmapFilter** | _@pixi/filter-simple-lightmap_ | ![simple-lightmap](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/simple-lightmap.png?v=2) |
| **TiltShiftFilter** | _@pixi/filter-tilt-shift_ | ![tilt-shift](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/tilt-shift.png?v=2) |
| **TwistFilter** | _@pixi/filter-twist_ | ![twist](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/twist.png?v=2) |

## Build-In Filters

PixiJS has a handful of core filters that are built-in to the PixiJS library.

| Filter | Preview |
|---|---|
| **DisplacementFilter** | ![displacement](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/displacement.png?v=2) |
| **BlurFilter** | ![blur](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/blur.png?v=2) |
| **NoiseFilter** | ![noise](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/noise.png?v=2) |
| **ColorMatrixFilter** (contrast) | ![color-matrix-contrast](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-contrast.png?v=2) |
| **ColorMatrixFilter** (desaturate) | ![color-matrix-desaturate](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-desaturate.png?v=2) |
| **ColorMatrixFilter** (kodachrome) | ![color-matrix-kodachrome](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-kodachrome.png?v=2) |
| **ColorMatrixFilter** (lsd) | ![color-matrix-lsd](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-lsd.png?v=2) |
| **ColorMatrixFilter** (negative) | ![color-matrix-negative](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-negative.png?v=2) |
| **ColorMatrixFilter** (polaroid) | ![color-matrix-polaroid](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-polaroid.png?v=2) |
| **ColorMatrixFilter** (predator) | ![color-matrix-predator](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-predator.png?v=2) |
| **ColorMatrixFilter** (saturate) | ![color-matrix-saturate](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-saturate.png?v=2) |
| **ColorMatrixFilter** (sepia) | ![color-matrix-sepia](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-sepia.png?v=2) |

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
