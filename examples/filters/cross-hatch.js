// cross-hatch

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.CrossHatchFilter();
    filter.enabled = false;

    var folder = gui.addFolder('CrossHatchFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));

    return filter;
});
