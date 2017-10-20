// drop-shadow

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.DropShadowFilter();
    filter.fishFilter = true;
    filter.enabled = false;

    var folder = gui.addFolder('DropShadowFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'blur', 0, 40);
    folder.add(filter, 'alpha', 0, 1);
    folder.add(filter, 'distance', 0, 50);
    folder.add(filter, 'rotation', 0, 360);
    folder.addColor(filter, 'color');

    return filter;
});
