// convolution

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.ConvolutionFilter([0, 0, 0, 1, 1, 1, 0, 0, 0], 300, 300);
    filter.enabled = false;

    var folder = gui.addFolder('ConvolutionFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'width', 0, 500);
    folder.add(filter, 'height', 0, 500);

    return filter;
});
