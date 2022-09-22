# AdjustmentFilter

PixiJS filter to adjust gamma, contrast, saturation, brightness or color channels.

## Installation

```bash
npm install @pixi/filter-adjustment
```

## Usage

```js
import {AdjustmentFilter} from '@pixi/filter-adjustment';
import {Container} from 'pixi.js';

const container = new Container();
container.filters = [new AdjustmentFilter()];
```

## Documentation

See https://filters.pixijs.download/main/docs/AdjustmentFilter.html