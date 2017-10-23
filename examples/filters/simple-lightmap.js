// simple-lightmap

FilterMakers.push(function(){
    var filter;

    var lightmap = resources.lightmap.texture;
    filter = new PIXI.filters.SimpleLightmapFilter(lightmap, 0x666666);
    filter.enabled = false;

    var folder = gui.addFolder('SimpleLightmapFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.addColor(filter, 'color');
    folder.add(filter, 'alpha', 0, 1);

    return filter;
});
