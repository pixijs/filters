// pixelate

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.PixelateFilter();
    filter.enabled = false;

    var folder = gui.addFolder('PixelateFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter.size, '0', 4, 40).name('size.x');
    folder.add(filter.size, '1', 4, 40).name('size.y');


    return filter;
});
