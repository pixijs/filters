# SimpleLightmapFilter

> PixiJS filter to create a light-map from a texture.

[View demo](https://filters.pixijs.download/main/demo/index.html?enabled=SimpleLightmapFilter)

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

See https://filters.pixijs.download/main/docs/SimpleLightmapFilter.html