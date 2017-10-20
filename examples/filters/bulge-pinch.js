// bulge-pinch

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.BulgePinchFilter();
    filter.enabled = false;

    var folder = gui.addFolder('BulgePinchFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'radius', 0, 1000);
    folder.add(filter, 'strength', -1, 1);
    folder.add(filter.center, '0', 0, 1).name('center.x');
    folder.add(filter.center, '1', 0, 1).name('center.y');

    return filter;
});
