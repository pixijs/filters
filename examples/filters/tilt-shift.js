// tilt-shift

FilterMakers.push(function(){
    var filter;

    filter = new PIXI.filters.TiltShiftFilter();
    filter.enabled = false;

    var folder = gui.addFolder('TiltShiftFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter, 'blur', 0, 200);
    folder.add(filter, 'gradientBlur', 0, 1000);

    return filter;
});
