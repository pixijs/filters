# PIXI Filters

[![Build Status](https://travis-ci.org/pixijs/pixi-filters.svg?branch=master)](https://travis-ci.org/pixijs/pixi-filters)

Include optional filters that work with Pixi.js v4.

Filters include:

* **AsciiFilter** _pixi-filters/bin/ascii_
* **BloomFilter** _pixi-filters/bin/bloom_
* **ConvolutionFilter** _pixi-filters/bin/convolution_
* **CrossHatchFilter** _pixi-filters/bin/crosshatch_
* **DotFilter** _pixi-filters/bin/dot_
* **EmbossFilter** _pixi-filters/bin/emboss_
* **PixelateFilter** _pixi-filters/bin/pixelate_
* **RGBSplitFilter** _pixi-filters/bin/rgb_
* **ShockwaveFilter** _pixi-filters/bin/shockwave_
* **TiltShiftFilter** _pixi-filters/bin/tiltshift_
* **TwistFilter** _pixi-filters/bin/twist_

## Examples

Click [here](http://pixijs.github.io/pixi-filters/examples) for filter demos.

## Installation

Using NPM:

```bash
npm install pixi-filters
```
Use Bower:

```bash
bower install pixi-filters
```

## Usage 

### Browser

```html
<script src="pixi.js/bin/pixi.js"></script>
<script src="pixi-filters/bin/filters.js"></script>
```
```js
var filter = new PIXI.filters.AsciiFilter();
```

#### Individual Filter

```html
<script src="pixi.js/bin/pixi.js"></script>
<script src="pixi-filters/bin/dot.js"></script>
```
```js
var filter = new PIXI.filters.DotFilter();
```

### NodeJS

```js
// Include library by requiring pixi-filters module
var filters = require('pixi-filters');
var filter = new filters.DotFilter();

// Alternatively, using PIXI.filters global object
require('pixi-filters');
var filter = new PIXI.filters.DotFilter();
```

#### Individual Filter

```js
// Using a single filter
var AsciiFilter = require('pixi-filters/bin/ascii');
var filter = new AsciiFilter();
```

## Rebuilding

Make sure you run NPM install to get the build dependencies.

```bash
npm install
```

Run the `build` command to build all filters.

```bash
npm run build
```
## Documentation

API documention can be found [here](http://pixijs.github.io/pixi-filters/docs/).
