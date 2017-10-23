// noise

FilterMakers.push(function() {
    var filter;

    filter = new PIXI.filters.NoiseFilter();
    filter.enabled = false;

    var folder = gui.addFolder('NoiseFilter (pixi.js)');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'noise', 0, 1);
    folder.add(filter, 'seed', 0.01, 0.99);

    return filter;
});
