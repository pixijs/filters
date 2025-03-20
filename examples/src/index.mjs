import DemoApplication from './DemoApplication.mjs';
import * as filters from './filters/index.mjs';
import { getEnabledFiltersFromQueryString } from './utils.mjs';
import './ga.mjs';

const main = async () =>
{
    const app = new DemoApplication();

    app.enabledFilters = getEnabledFiltersFromQueryString();

    await app.init();
    await app.load([
        { alias: 'background', src: 'images/displacement_BG.jpg' },
        { alias: 'overlay', src: 'images/overlay.png' },
        { alias: 'map', src: 'images/displacement_map.png' },
        { alias: 'fish1', src: 'images/displacement_fish1.png' },
        { alias: 'fish2', src: 'images/displacement_fish2.png' },
        { alias: 'fish3', src: 'images/displacement_fish3.png' },
        { alias: 'fish4', src: 'images/displacement_fish4.png' },
        { alias: 'fish5', src: 'images/displacement_fish5.png' },
        { alias: 'lightmap', src: 'images/lightmap.png' },
        { alias: 'colormap', src: 'images/colormap.png' },
    ]);

    for (const i in filters)
    {
        filters[i].call(app);
    }
};

main();
