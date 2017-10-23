// twist

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.TwistFilter();
    filter.enabled = false;
    filter.offset = new PIXI.Point(stageWidth / 2, stageHeight / 2);

    var folder = gui.addFolder('TwistFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'angle', -10, 10);
    folder.add(filter, 'radius', 0, stageWidth);
    folder.add(filter.offset, 'x', 0, stageWidth);
    folder.add(filter.offset, 'y', 0, stageHeight);

    return filter;
});
