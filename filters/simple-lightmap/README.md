# SimpleLightmapFilter

PixiJS filter to create a light-map from a texture.

## Installation

```bash
npm install @pixi/filter-simple-lightmap
```

## Usage

```js
import {SimpleLightmapFilter} from '@pixi/filter-simple-lightmap';
import {Container} from 'pixi.js';

const container = new Container();
container.filters = [new SimpleLightmapFilter(texture, [0, 0, 0, 0.5])];
```

## Documentation

See https://pixijs.github.io/pixi-filters/docs