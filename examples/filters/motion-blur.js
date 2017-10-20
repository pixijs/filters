// motion-blur

FilterMakers.push(function(){
    var filter;

    var velocity = [40, 40];
    filter = new PIXI.filters.MotionBlurFilter(velocity, 15);
    filter.enabled = false;
    var folder = gui.addFolder('MotionBlurFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(velocity, '0', -90, 90).name('velocity.x').onChange(function() {
        filter.velocity = velocity;
    });
    folder.add(velocity, '1', -90, 90).name('velocity.y').onChange(function() {
        filter.velocity = velocity;
    });
    folder.add(filter, 'kernelSize', [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]).name('kernelSize');
    folder.add(filter, 'offset', -150, 150).name('offset');

    return filter;
});
