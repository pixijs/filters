// advanced-bloom

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.AdvancedBloomFilter();
    filter.enabled = false;

    var folder = gui.addFolder('AdvancedBloomFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'threshold', 0.1, 0.9);
    folder.add(filter, 'bloomScale', 0.5, 1.5);
    folder.add(filter, 'brightness', 0.5, 1.5);
    folder.add(filter, 'blur', 0, 20);

    return filter;
});
