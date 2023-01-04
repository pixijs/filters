# HueRotationFilter

> PixiJS filter to apply a hue rotation.

[View demo](https://filters.pixijs.download/main/demo/index.html?enabled=HueRotationFilter)

## Installation

```bash
npm install @pixi/filter-hue-rotation
```

## Usage

```js
import { HueRotationFilter } from '@pixi/filter-hue-rotation';
import { Container } from 'pixi.js';

const container = new Container();
container.filters = [
  new HueRotationFilter({
    angle: 45,
    alpha: 0.8,
    colorize: true,
  })
];
```

## Documentation

See https://filters.pixijs.download/main/docs/HueRotationFilter.html