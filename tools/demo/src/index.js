import './ga';
import DemoApplication from './DemoApplication';
import * as filters from './filters';
import { getEnabledFiltersFromQueryString } from './utils';

const main = async () =>
{
    const app = new DemoApplication();

    app.enabledFilters = getEnabledFiltersFromQueryString();

    await app.load({
        background: 'images/displacement_BG.jpg',
        overlay: 'images/overlay.png',
        map: 'images/displacement_map.png',
        fish1: 'images/displacement_fish1.png',
        fish2: 'images/displacement_fish2.png',
        fish3: 'images/displacement_fish3.png',
        fish4: 'images/displacement_fish4.png',
        fish5: 'images/displacement_fish5.png',
        lightmap: 'images/lightmap.png',
        colormap: 'images/colormap.png',
    });
    for (const i in filters)
    {
        filters[i].call(app);
    }
};

main();
