// zoom-blur

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.ZoomBlurFilter(0.1, [stageWidth / 2, stageHeight / 2], 80);
    filter.enabled = false;

    var folder = gui.addFolder('ZoomBlurFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'strength', 0.01, 0.5);
    folder.add(filter.center, '0', 0, stageWidth).name('center.x');
    folder.add(filter.center, '1', 0, stageHeight).name('center.y');
    folder.add(filter, 'innerRadius', 0, stageWidth / 2);

    return filter;
});
