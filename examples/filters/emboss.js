// emboss

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.EmbossFilter();
    filter.enabled = false;

    var folder = gui.addFolder('EmbossFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'strength', 0, 20);

    return filter;
});
