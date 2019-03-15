# PixiJS Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters) [![CDNJS](https://img.shields.io/cdnjs/v/pixi-filters.svg)](https://cdnjs.com/libraries/pixi-filters)

PixiJS v5 optional display filters.

Filters include:

* **AdjustmentFilter** _@pixi/filter-adjustment_
* **AdvancedBloomFilter** _@pixi/filter-advanced-bloom_
* **AsciiFilter** _@pixi/filter-ascii_
* **BevelFilter** _@pixi/filter-bevel_
* **BloomFilter** _@pixi/filter-bloom_
* **BulgePinchFilter** _@pixi/filter-bulge-pinch_
* **ColorMapFilter** _@pixi/filter-color-map_
* **ColorReplaceFilter** _@pixi/filter-color-replace_
* **ConvolutionFilter** _@pixi/filter-convolution_
* **CrossHatchFilter** _@pixi/filter-cross-hatch_
* **CRTFilter** _@pixi/filter-crt_
* **DotFilter** _@pixi/filter-dot_
* **DropShadowFilter** _@pixi/filter-drop-shadow_
* **EmbossFilter** _@pixi/filter-emboss_
* **GlitchFilter** _@pixi/filter-glitch_
* **GlowFilter** _@pixi/filter-glow_
* **GodrayFilter** _@pixi/filter-godray_
* **KawaseBlurFilter** _@pixi/filter-kawase-blur_
* **MotionBlurFilter** _@pixi/filter-motion-blur_
* **MultiColorFilter** _@pixi/filter-multi-color-replace_
* **OldFilmFilter** _@pixi/filter-old-film_
* **OutlineFilter** _@pixi/filter-outline_
* **PixelateFilter** _@pixi/filter-pixelate_
* **RadialBlurFilter** _@pixi/filter-radial-blur_
* **ReflectionFilter** _@pixi/filter-reflection_
* **RGBSplitFilter** _@pixi/filter-rgb_
* **ShockwaveFilter** _@pixi/filter-shockwave_
* **SimpleLightmapFilter** _@pixi/filter-simple-lightmap_
* **TiltShiftFilter** _@pixi/filter-tilt-shift_
* **TwistFilter** _@pixi/filter-twist_
* **ZoomBlurFilter** _@pixi/filter-zoom-blur_

## Examples

Click [here](http://pixijs.io/pixi-filters/tools/demo/) for filter demos.

## Installation

Using NPM:

```bash
npm install pixi-filters
```

Using Yarn:
```bash
yarn add pixi-filters
```

## Usage

### Browser

```html
<script src="https://pixijs.download/release/pixi.min.js"></script>
<script src="pixi-filters/dist/pixi-filters.js"></script>
```
```js
var filter = new PIXI.filters.AsciiFilter();
```

### Bundler (Rollup, Webpack, etc)

Use ES6+ imports to import the specific filter. _Note: `PIXI` global is not accessible when building with bundlers._

```js
import { DotFilter } from 'pixi-filters';
const filter = new DotFilter();
```

## Documentation

API documention can be found [here](http://pixijs.github.io/pixi-filters/docs/).
