# MotionBlurFilter

> PixiJS filter to apply a directional blur effect.

[View demo](https://filters.pixijs.download/main/demo/index.html?enabled=MotionBlurFilter)

## Installation

```bash
npm install @pixi/filter-motion-blur
```

## Usage

```js
import {MotionBlurFilter} from '@pixi/filter-motion-blur';
import {Container} from 'pixi.js';

const container = new Container();
container.filters = [new MotionBlurFilter([1,2], 9)];
```

## Documentation

See https://filters.pixijs.download/main/docs/MotionBlurFilter.html
