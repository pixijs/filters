// godray

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.GodrayFilter();
    filter.enabled = false;

    var folder = gui.addFolder('GodrayFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'time', 0, 1);
    folder.add(filter, 'angle', -60, 60);
    folder.add(filter, 'gain', 0, 1);
    folder.add(filter, 'lacunarity', 0, 5);

    return filter;
});
