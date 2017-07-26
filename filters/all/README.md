# PixiJS Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters) [![CDNJS](https://img.shields.io/cdnjs/v/pixi-filters.svg)](https://cdnjs.com/libraries/pixi-filters)

Optional filters that work with PixiJS v4.

Filters include:

* **AsciiFilter** _@pixi/filters-ascii_
* **BloomFilter** _@pixi/filters-bloom_
* **BulgePinchFilter** _@pixi/filters-bulge-pinch_
* **ColorReplaceFilter** _@pixi/filters-color-replace_
* **ConvolutionFilter** _@pixi/filters-convolution_
* **CrossHatchFilter** _@pixi/filters-cross-hatch_
* **DotFilter** _@pixi/filters-dot_
* **DropShadowFilter** _@pixi/filters-drop-shadow_
* **GlowFilter** _@pixi/filters-glow_
* **EmbossFilter** _@pixi/filters-emboss_
* **PixelateFilter** _@pixi/filters-pixelate_
* **OutlineFilter** _@pixi/filters-outline_
* **RGBSplitFilter** _@pixi/filters-rgb_
* **ShockwaveFilter** _@pixi/filters-shockwave_
* **SimpleLightmapFilter** _@pixi/filters-simple-lightmap_
* **TiltShiftFilter** _@pixi/filters-tilt-shift_
* **TwistFilter** _@pixi/filters-twist_

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
