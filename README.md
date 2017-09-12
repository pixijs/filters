# PixiJS Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters)

## Filters

All filters work with PixiJS v4.

| Filter | Package | Preview |
|---|---|---|
| **AsciiFilter** | _@pixi/filter-ascii_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/ascii.png) |
| **BloomFilter** | _@pixi/filter-bloom_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/bloom.png) |
| **BulgePinchFilter** | _@pixi/filter-bulge-pinch_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/bulge-pinch.gif) |
| **ColorReplaceFilter** | _@pixi/filter-color-replace_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-replace.png) |
| **ConvolutionFilter** | _@pixi/filter-convolution_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/convolution.png) |
| **CrossHatchFilter** | _@pixi/filter-cross-hatch_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/cross-hatch.png) |
| **DotFilter** | _@pixi/filter-dot_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/dot.png) |
| **DropShadowFilter** | _@pixi/filter-drop-shadow_| ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/drop-shadow.png) |
| **GlowFilter** | _@pixi/filter-glow_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/glow.png) |
| **EmbossFilter** | _@pixi/filter-emboss_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/emboss.png) |
| **PixelateFilter** | _@pixi/filter-pixelate_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/pixelate.png) |
| **OutlineFilter** | _@pixi/filter-outline_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/outline.png) |
| **RGBSplitFilter** | _@pixi/filter-rgb_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/rgb.png) |
| **ShockwaveFilter** | _@pixi/filter-shockwave_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/shockwave.gif) |
| **SimpleLightmapFilter** | _@pixi/filter-simple-lightmap_ | (no preview) |
| **TiltShiftFilter** | _@pixi/filter-tilt-shift_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/tilt-shift.png) |
| **TwistFilter** | _@pixi/filter-twist_ | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/twist.png) |

## Build-In Filters

PixiJS has a handful of core filters that are built-in to the PixiJS library.

| Filter | Preview |
|---|---|
| **DisplacementFilter** | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/displacement.png) |
| **BlurFilter** | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/blur.png) |
| **NoiseFilter** | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/noise.png) |
| **ColorMatrixFilter** (contrast) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-contrast.png) |
| **ColorMatrixFilter** (desaturate) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-desaturate.png) |
| **ColorMatrixFilter** (kodachrome) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-kodachrome.png) |
| **ColorMatrixFilter** (lsd) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-lsd.png) |
| **ColorMatrixFilter** (negative) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-negative.png) |
| **ColorMatrixFilter** (polaroid) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-polaroid.png) |
| **ColorMatrixFilter** (predator) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-predator.png) |
| **ColorMatrixFilter** (saturate) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-saturate.png) |
| **ColorMatrixFilter** (sepia) | ![original](https://pixijs.github.io/pixi-filters/tools/screenshots/dist/color-matrix-sepia.png) |

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
