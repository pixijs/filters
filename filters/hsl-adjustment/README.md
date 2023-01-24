# HslAdjustmentFilter

> PixiJS filter to apply a HSL adjustment.

[View demo](https://filters.pixijs.download/main/demo/index.html?enabled=HslAdjustmentFilter)

## Installation

```bash
npm install @pixi/filter-hsl-adjustment
```

## Usage

```js
import { HslAdjustmentFilter } from '@pixi/filter-hsl-adjustment';
import { Container } from 'pixi.js';

const container = new Container();
container.filters = [
  new HslAdjustmentFilter({
    hue: 180,
    colorize: true,
  })
];
```

## Documentation

See https://filters.pixijs.download/main/docs/HslAdjustmentFilter.html
