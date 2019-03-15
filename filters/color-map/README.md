# ColorMapFilter

PixiJS filter to apply a color-map effect.

## Installation

```bash
npm install @pixi/filter-color-map
```

## Usage

```js
import {ColorMapFilter} from '@pixi/filter-color-map';
import {Container} from 'pixi.js';

const container = new Container();
const colorMap = new Image();
colorMap.src = 'foo/bar/colorMap.png';

container.filters = [new ColorMapFilter(colorMap)];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs
