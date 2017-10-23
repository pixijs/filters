var gui = new dat.GUI();
gui.useLocalStorage = false;

var emitter = new EventEmitter();

// gui.close();

var $ = document.querySelector.bind(document);
var view = $('#stage');
var container = $('#container');
var stageWidth = container.offsetWidth;
var stageHeight = container.offsetHeight;

// Create the application
var app = new PIXI.Application({
    view: view,
    width: stageWidth,
    height: stageHeight,
    backgroundColor: 0x000000,
});

function trackEvent(enabled) {
    ga('send', 'event',
        this.name.replace(' (pixi.js)', ''),
        enabled ? 'enabled' : 'disabled'
    );
    app.render();
    if (enabled) {
        this.domElement.className += ' enabled';
    } else {
        this.domElement.className = this.domElement.className.replace(' enabled', '');
    }
}


// Preload the assets needed
app.stop();
app.loader
    .add('background', 'images/displacement_BG.jpg')
    .add('overlay', 'images/overlay.png')
    .add('map', 'images/displacement_map.png')
    .add('fish1', 'images/displacement_fish1.png')
    .add('fish2', 'images/displacement_fish2.png')
    .add('fish3', 'images/displacement_fish3.png')
    .add('fish4', 'images/displacement_fish4.png')
    .add('lightmap', 'images/lightmap.png')
    .load(function(loader, resources) {
        gui.add(window, 'paused').name('<i class="fa fa-pause"></i> Pause stage');
        init(resources);
        app.start();
    });


window.paused = false;

window.FilterMakers = [];
window.filters = [];
window.pondFilters = [];
window.fishFilters = [];

var padding = 100;
var bounds = new PIXI.Rectangle(-padding, -padding,
    stageWidth + padding * 2,
    stageHeight + padding * 2
);

var filterAreaPadding = 4;
var filterArea = new PIXI.Rectangle();

var bg;
var pond;
var fishes = [];
var overlay;

var resources;

function init(_resources) {
    resources = _resources;

    // Setup the container
    pond = new PIXI.Container();
    pond.filterArea = filterArea;
    // pond.filters = window.pondFilters;
    app.stage.addChild(pond);

    // Setup the background image
    bg = new PIXI.Sprite(resources.background.texture);
    bg.width = window.screen.availWidth;
    bg.height = window.screen.availHeight;
    // Add the background
    pond.addChild(bg);


    // Create and add the fish
    for (var i = 0; i < 20; i++) {
        var id = 'fish' + ((i % 4) + 1);
        var fish = new PIXI.Sprite(resources[id].texture);
        fish.anchor.set(0.5);
        // fish.filters = window.fishFilters;

        pond.addChild(fish);

        fish.direction = Math.random() * Math.PI * 2;
        fish.speed = 2 + Math.random() * 2;
        fish.turnSpeed = Math.random() - 0.8;

        fish.x = Math.random() * bounds.width;
        fish.y = Math.random() * bounds.height;

        fish.scale.set(0.8 + Math.random() * 0.3);
        fishes.push(fish);
    }

    // Setup the tiling sprite
    overlay = new PIXI.extras.TilingSprite(
        resources.overlay.texture,
        stageWidth,
        stageHeight
    );
    // Add the overlay
    pond.addChild(overlay);

    window.addEventListener('resize', resize);

    resize();

    var count = 0;

    app.ticker.add(function(delta) {
        count += 0.1 * delta;

        if (!window.paused) {
            // Animate the overlay
            overlay.tilePosition.x = count * -10;
            overlay.tilePosition.y = count * -10;

            emitter.emitEvent('tick', [delta, count]);

            for (var i = 0; i < fishes.length; i++) {
                var fish = fishes[i];

                fish.direction += fish.turnSpeed * 0.01;

                fish.x += Math.sin(fish.direction) * fish.speed;
                fish.y += Math.cos(fish.direction) * fish.speed;

                fish.rotation = -fish.direction - Math.PI / 2;

                if (fish.x < bounds.x) {
                    fish.x += bounds.width;
                }
                if (fish.x > bounds.x + bounds.width) {
                    fish.x -= bounds.width
                }
                if (fish.y < bounds.y) {
                    fish.y += bounds.height;
                }
                if (fish.y > bounds.y + bounds.height) {
                    fish.y -= bounds.height
                }
            }
        }
    });

    setTimeout(function() {
        initFilters();
    }, 100);
}

function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    overlay.width = width;
    overlay.height = height;

    bounds.x = -padding;
    bounds.y = -padding;
    bounds.width = width + padding * 2;
    bounds.height = height + padding * 2;

    filterArea.x = filterAreaPadding;
    filterArea.y = filterAreaPadding;
    filterArea.width = width - filterAreaPadding * 2;
    filterArea.height = height - filterAreaPadding * 2;

    emitter.emitEvent('resize', [width, height]);

    app.renderer.resize(
        width,
        height
    );

    stageWidth = width;
    stageHeight = height;
}

function initFilters() {
    FilterMakers.forEach(function(maker, index) {
        var filter = maker && maker();
        if (!filter) {
            console.error("WRONG filter maker: ", index, maker);
            return;
        }
        window.filters.push(filter);
        if (filter.fishFilter) {
            window.fishFilters.push(filter);
        } else {
            window.pondFilters.push(filter);
        }
    });
    pond.filters = window.pondFilters;
    fishes.forEach(function(fish) {
        fish.filters = window.fishFilters;
    });
}
