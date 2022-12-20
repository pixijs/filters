# ColorGradientFilter

PixiJS filter to render a color gradient.

## Installation

```bash
npm install @pixi/filter-color-gradient
```

## Usage

```js
import { ColorGradientFilter } from '@pixi/filter-color-gradient';
import { Container } from 'pixi.js';

const container = new Container();

const stops: GradientStop[] = [
    { offset: 0.0, color: 0xff0000, alpha: 1.0, },
    { offset: 0.5, color: 0x00ff00, alpha: 0.5, },
    { offset: 1.0, color: 0x0000ff, alpha: 1.0, },
];
const alpha = 1.0;

container.filters = [new ColorGradientFilter(stops, alpha)];
```

## Documentation

See https://filters.pixijs.download/main/docs/ColorGradientFilter.html