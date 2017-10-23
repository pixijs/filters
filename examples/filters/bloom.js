// bloom

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.BloomFilter();
    filter.enabled = false;

    var folder = gui.addFolder('BloomFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'blur', 0, 20);
    folder.add(filter, 'blurX', 0, 20);
    folder.add(filter, 'blurY', 0, 20);

    return filter;
});
