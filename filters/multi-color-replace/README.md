# MultiColorReplaceFilter

PixiJS v4 filter to render Multi Color Replace effect.

## Installation

```bash
npm install @pixi/filter-multi-color-replace
```

## Usage

```js
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';

const container = new PIXI.Container();
container.filters = [new MultiColorReplaceFilter([0x0000FF, 0x00FF00], [0xFF0000, 0xFFFF00], 0.2)];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs