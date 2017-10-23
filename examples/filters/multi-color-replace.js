// multi-color-replace

FilterMakers.push(function(){
    var filter;

    var replacements = [
        [3238359, 16711680],
        [938417, 65280],
        [1464209, 16776960],
    ];
    filter = new PIXI.filters.MultiColorReplaceFilter(replacements, 0.2);
    var refresh = filter.refresh.bind(filter);
    filter.enabled = false;

    var folder = gui.addFolder('MultiColorReplaceFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.addColor(replacements[0], '0').name('original 0').onChange(refresh);
    folder.addColor(replacements[0], '1').name('target 0').onChange(refresh);
    folder.addColor(replacements[1], '0').name('original 1').onChange(refresh);
    folder.addColor(replacements[1], '1').name('target 1').onChange(refresh);
    folder.addColor(replacements[2], '0').name('original 2').onChange(refresh);
    folder.addColor(replacements[2], '1').name('target 2').onChange(refresh);
    folder.add(filter, 'epsilon', 0, 1);

    return filter;
});
