# simple-lightmapFilter

PixiJS v4 filter to render DisplayObject as simple-lightmap text.

## Installation

```bash
npm install @pixi/filter-simple-lightmap
```

## Usage

```js
import {SimpleLightmapFilter} from '@pixi/filter-simple-lightmap';

const container = new PIXI.Container();
container.filters = [new SimpleLightmapFilter(texture, [0, 0, 0, 0.5])];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs