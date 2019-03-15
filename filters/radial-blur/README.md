# RadialBlurFilter

PixiJS filter to apply a radial blur effect.

## Installation

```bash
npm install @pixi/filter-radial-blur
```

## Usage

```js
import {RadialBlurFilter} from '@pixi/filter-radial-blur';
import {Container} from 'pixi.js';

const container = new Container();
container.filters = [new RadialBlurFilter(60, 9)];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs
