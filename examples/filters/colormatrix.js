// colormatrix

FilterMakers.push(function() {
    var filter;

    filter = new PIXI.filters.ColorMatrixFilter();
    filter.enabled = false;

    var folder = gui.addFolder('ColorMatrixFilter (pixi.js)');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'reset');
    folder.add(filter, 'sepia');
    folder.add(filter, 'negative');
    folder.add({
        kodachrome: filter.kodachrome.bind(filter, true)
    }, 'kodachrome');
    folder.add({
        lsd: filter.lsd.bind(filter, true)
    }, 'lsd');
    folder.add(filter, 'polaroid');
    folder.add(filter, 'desaturate');
    folder.add({
        contrast: filter.contrast.bind(filter, 1)
    }, 'contrast');
    folder.add({
        greyscale: filter.greyscale.bind(filter, 1)
    }, 'greyscale');
    folder.add({
        predator: filter.predator.bind(filter, 1)
    }, 'predator');
    folder.add({
        saturate: filter.saturate.bind(filter, 1)
    }, 'saturate');

    return filter;
});
