// displacement

FilterMakers.push(function(){
    var filter;

    resources.map.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    var displacementSprite = new PIXI.Sprite(resources.map.texture);
    emitter.addListener('resize', function(width, height) {
        displacementSprite.width = width;
        displacementSprite.height = height;
    });
    // displacement

    filter = new PIXI.filters.DisplacementFilter(
        displacementSprite,
        stageWidth,
        stageHeight
    );
    emitter.addListener('tick', function(delta, count) {
        filter.x = count * 10;
        filter.y = count * 10;
    });

    filter.enabled = true;
    filter.scale.x = 50;
    filter.scale.y = 50;

    var folder = gui.addFolder('DisplacementFilter (pixi.js)');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));
    folder.add(filter.scale, 'x', 1, 200).name('scale.x');
    folder.add(filter.scale, 'y', 1, 200).name('scale.y');
    folder.domElement.className += ' enabled';

    return filter;
});
