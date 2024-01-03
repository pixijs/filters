import './ga';
import DemoApplication from './DemoApplication';
import * as filters from './filters';
import { getEnabledFiltersFromQueryString } from './utils';

const main = async () =>
{
    const app = new DemoApplication();

    app.enabledFilters = getEnabledFiltersFromQueryString();

    await app.init({ preference: 'webgl' });
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

    // filters.alpha.call(app);
    // filters.blur.call(app);
    // filters.colorMatrix.call(app);
    // filters.displacement.call(app);
    // filters.noise.call(app);

    // TODO: https://github.com/orgs/pixijs/projects/2/views/4?pane=issue&itemId=48586590
    // filters.shockwave.call(app);

    filters.adjustment.call(app);
    filters.bloom.call(app);
    filters.grayscale.call(app);
    filters.twist.call(app);
    filters.pixelate.call(app);
    filters.glow.call(app);
    filters.hslAdjustment.call(app);
    filters.rgb.call(app);
    filters.ascii.call(app);
    filters.crossHatch.call(app);
    filters.convolution.call(app);
    filters.dot.call(app);
    filters.shockwave.call(app);
    filters.zoomBlur.call(app);
    filters.colorOverlay.call(app);
    filters.colorReplace.call(app);
    filters.multiColorReplace.call(app);
    filters.colorMap.call(app);
    filters.colorGradient.call(app);
    filters.bulgePinch.call(app);
    filters.bevel.call(app);
    filters.crt.call(app);
    filters.godray.call(app);
    filters.reflection.call(app);
    filters.simpleLightmap.call(app);
    filters.kawaseBlur.call(app);
    filters.motionBlur.call(app);
    filters.outline.call(app);
    filters.emboss.call(app);
    filters.radialBlur.call(app);

    // TODO: Re-enable this in place of the above once v8 conversion is complete
    // for (const i in filters)
    // {
    //     filters[i].call(app);
    // }
};

main();
