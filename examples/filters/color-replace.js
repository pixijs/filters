// color-replace

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.ColorReplaceFilter();
    filter.enabled = false;

    var folder = gui.addFolder('ColorReplaceFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.addColor(filter, 'originalColor');
    folder.addColor(filter, 'newColor');
    folder.add(filter, 'epsilon', 0, 1);

    return filter;
});
