# ColorAdjustFilter

PixiJS v4 filter to apply a color-adjust effect.

## Installation

```bash
npm install @pixi/filter-color-adjust
```

## Usage

```js
import {ColorAdjustFilter} from '@pixi/filter-color-adjust';
import {Container} from 'pixi.js';

const container = new Container();

const colorMap = new Image();
colorMap.src='foo/bar/colorMap.png';

container.filters = [new ColorAdjustFilter(colorMap)];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs
