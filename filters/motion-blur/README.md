# MotionBlurFilter

PixiJS filter to apply a directional blur effect.

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

See https://pixijs.github.io/pixi-filters/docs
