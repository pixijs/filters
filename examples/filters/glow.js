// glow

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.GlowFilter(15, 2, 1, 0xffffff, 0.1);
    filter.fishFilter = true;
    filter.enabled = false;

    var folder = gui.addFolder('GlowFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'innerStrength', 0, 20);
    folder.add(filter, 'outerStrength', 0, 20);
    folder.add(filter, 'distance', 10, 20);
    folder.addColor(filter, 'color');

    return filter;
});
