// dot

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.DotFilter();
    filter.enabled = false;

    var folder = gui.addFolder('DotFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'scale', 0.3, 1);
    folder.add(filter, 'angle', 0, 5);

    return filter;
});
