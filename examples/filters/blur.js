// blur

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.BlurFilter();
    filter.enabled = false;

    var folder = gui.addFolder('BlurFilter (pixi.js)');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'blur', 0, 100);
    folder.add(filter, 'quality', 1, 10);

    return filter;
});
