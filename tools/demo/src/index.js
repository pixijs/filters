import 'pixi-filters';
import './ga';
import DemoApplication from './DemoApplication';
import * as filters from './filters';

const app = new DemoApplication();
const manifest = [
    { name: 'background', url: 'images/displacement_BG.jpg' },
    { name: 'overlay', url: 'images/overlay.png' },
    { name: 'map', url: 'images/displacement_map.png' },
    { name: 'fish1', url: 'images/displacement_fish1.png' },
    { name: 'fish2', url: 'images/displacement_fish2.png' },
    { name: 'fish3', url: 'images/displacement_fish3.png' },
    { name: 'fish4', url: 'images/displacement_fish4.png' },
    { name: 'lightmap', url: 'images/lightmap.png' }
];

// Load resources then add filters
app.load(manifest, () => {
    for (const i in filters) {
        filters[i].call(app);
    }
});
