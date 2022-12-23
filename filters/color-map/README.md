# ColorMapFilter

> PixiJS filter to apply a color-map effect.

[View demo](https://filters.pixijs.download/main/demo/index.html?enabled=ColorMapFilter)

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

See https://filters.pixijs.download/main/docs/ColorMapFilter.html
