// shockwave

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.ShockwaveFilter();
    filter.enabled = false;

    var folder = gui.addFolder('ShockwaveFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'time', 0, 1);
    folder.add(filter.center, '0', 0, 1).name('center.x');
    folder.add(filter.center, '1', 0, 1).name('center.y');

    return filter;
});
