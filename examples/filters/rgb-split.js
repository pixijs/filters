// rgb-split

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.RGBSplitFilter();
    filter.enabled = false;

    var folder = gui.addFolder('RGBSplitFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter.red, '0', -20, 20).name('red.x');
    folder.add(filter.red, '1', -20, 20).name('red.y');
    folder.add(filter.blue, '0', -20, 20).name('blue.x');
    folder.add(filter.blue, '1', -20, 20).name('blue.y');
    folder.add(filter.green, '0', -20, 20).name('green.x');
    folder.add(filter.green, '1', -20, 20).name('green.y');

    return filter;
});
