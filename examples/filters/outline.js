// outline

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.OutlineFilter();
    filter.fishFilter = true;
    filter.enabled = false;

    var folder = gui.addFolder('OutlineFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'thickness', 0, 20);
    folder.addColor(filter, 'color');

    return filter;
});
