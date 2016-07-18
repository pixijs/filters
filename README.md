# Pixi.js Filters

Include optional filters that work with Pixi.js v4.

Filters include:

* AsciiFilter (`pixi-filters/ascii`)
* BloomFilter (`pixi-filters/bloom`)
* ConvolutionFilter (`pixi-filters/convolution`)
* CrossHatchFilter (`pixi-filters/crosshatch`)
* DotFilter (`pixi-filters/dot`)
* EmbossFilter (`pixi-filters/emboss`)
* PixelateFilter (`pixi-filters/pixelate`)
* RGBSplitFilter (`pixi-filters/rgb`)
* ShockwaveFilter (`pixi-filters/shockwafe`)
* TiltShiftFilter (`pixi-filters/tiltshift`)
* TwistFilter (`pixi-filters/twist`)

## Installation

Using NPM:

```bash
npm install pixi-filters
```
Use Bower:

``bash
bower install pixi-filters
```

## Usage 

### Browser

```html
<script src="pixi.js/bin/pixi.js"></script>
<script src="pixi-filters/bin/index.js"></script>
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
var AsciiFilter = require('pixi-filters/ascii');
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