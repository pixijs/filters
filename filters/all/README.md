# PixiJS Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters) [![CDNJS](https://img.shields.io/cdnjs/v/pixi-filters.svg)](https://cdnjs.com/libraries/pixi-filters)

Optional filters that work with PixiJS v4.

Filters include:

* **AsciiFilter** _@pixi/filter-ascii_
* **AdvancedBloomFilter** _@pixi/filter-advanced-bloom_
* **BloomFilter** _@pixi/filter-bloom_
* **BulgePinchFilter** _@pixi/filter-bulge-pinch_
* **ColorReplaceFilter** _@pixi/filter-color-replace_
* **ConvolutionFilter** _@pixi/filter-convolution_
* **CrossHatchFilter** _@pixi/filter-cross-hatch_
* **DotFilter** _@pixi/filter-dot_
* **DropShadowFilter** _@pixi/filter-drop-shadow_
* **GlowFilter** _@pixi/filter-glow_
* **GodrayFilter** _@pixi/filter-godray_
* **EmbossFilter** _@pixi/filter-emboss_
* **MultiColorFilter** _@pixi/filter-multi-color-replace_
* **PixelateFilter** _@pixi/filter-pixelate_
* **OutlineFilter** _@pixi/filter-outline_
* **RGBSplitFilter** _@pixi/filter-rgb_
* **ShockwaveFilter** _@pixi/filter-shockwave_
* **SimpleLightmapFilter** _@pixi/filter-simple-lightmap_
* **TiltShiftFilter** _@pixi/filter-tilt-shift_
* **TwistFilter** _@pixi/filter-twist_
* **ZoomBlurFilter** _@pixi/filter-zoom-blur_

## Examples

Click [here](https://pixijs.github.io/pixi-filters/examples) for filter demos.

## Installation

Using NPM:

```bash
npm install pixi-filters
```

## Usage

### Browser

```html
<script src="https://pixijs.download/release/pixi.min.js"></script>
<script src="pixi-filters/lib/pixi-filters.min.js"></script>
```
```js
var filter = new PIXI.filters.AsciiFilter();
```

### Rollup or Webpack

```js
// Include library by requiring pixi-filters module
import * as filters from 'pixi-filters';
const filter = new filters.DotFilter();

// Alternatively, using PIXI.filters global object
import 'pixi-filters';
const filter = new PIXI.filters.DotFilter();
```

## Documentation

API documention can be found [here](http://pixijs.github.io/pixi-filters/docs/).
