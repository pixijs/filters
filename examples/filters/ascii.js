// ascii

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.AsciiFilter();
    filter.enabled = false;

    var folder = gui.addFolder('AsciiFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'size', 2, 20);

    return filter;
});
