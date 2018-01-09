# KawaseBlurFilter

PixiJS v4 filter to render Blur effect with kawase algorithm.

## Installation

```bash
npm install @pixi/filter-kawase-blur
```

## Usage

```js
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur';

const container = new PIXI.Container();
container.filters = [new KawaseBlurFilter([4, 3, 2, 1], [1, 1])];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs
