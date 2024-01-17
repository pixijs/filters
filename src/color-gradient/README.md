# ColorGradientFilter

> PixiJS filter to render a color gradient.

[View demo](https://filters.pixijs.download/main/demo/index.html?enabled=ColorGradientFilter)

## Installation

```bash
npm install @pixi/filter-color-gradient
```

## Usage

```js
import { ColorGradientFilter } from '@pixi/filter-color-gradient';
import { Container } from 'pixi.js';

const container = new Container();

const options = {
  type: ColorGradientFilter.LINEAR,
  stops: [
    { offset: 0.0, color: 'red', alpha: 1.0, },
    { offset: 1.0, color: 'blue', alpha: 1.0, },
  ],
  angle: 90,
  alpha: 0.8,
}

container.filters = [new ColorGradientFilter(options)];
```

### Color values

The following values can be used to define a color.

| Description                 | Type       | Example               |
|-----------------------------|------------|-----------------------|
| [CSS color name][css_names] | `string`   | `"red"`               |
| Hexadecimal string          | `string`   | `"#ff0000"`, `"#f00"` |
| Hexadecimal number          | `number`   | `0xff0000`            |
| Array of numbers [R,G,B]    | `number[]` | `[1.0, 0.0, 0.0]`     |

## Documentation

See https://filters.pixijs.download/main/docs/ColorGradientFilter.html


[css_names]: https://developer.mozilla.org/en-US/docs/Web/CSS/named-color
