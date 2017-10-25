/*global dat,ga*/
/**
 * Demo show a bunch of fish and a dat.gui controls
 * @class
 * @extends PIXI.Application
 */
export default class DemoApplication extends PIXI.Application {

    constructor() {

        const gui = new dat.GUI();
        gui.useLocalStorage = false;

        // Get the initial dementions for the application
        const domElement = document.querySelector('#container');
        const initWidth = domElement.offsetWidth;
        const initHeight = domElement.offsetHeight;

        super({
            view: document.querySelector('#stage'),
            width: initWidth,
            height: initHeight,
            autoStart: false,
            backgroundColor:0x000000,
        });

        this.domElement = domElement;

        this.initWidth = initWidth;
        this.initHeight = initHeight;
        this.paused = false;
        this.renderPaused = false;
        this.events = new PIXI.utils.EventEmitter();
        this.animateTimer = 0;
        this.bg = null;
        this.pond = null;
        this.fishes = [];
        this.fishFilters = [];
        this.pondFilters = [];
        this.filterArea = new PIXI.Rectangle();
        this.padding = 100;
        this.bounds = new PIXI.Rectangle(
            -this.padding,
            -this.padding,
            initWidth + this.padding * 2,
            initHeight + this.padding * 2
        );

        const app = this;

        this.gui = gui;
        this.gui.add(this, 'renderPaused').name('<b>*</b> Pause Render')
            .onChange(function(value){
                if (value) {
                    app.stop();
                }
                else {
                    app.start();
                }
            });
        this.gui.add(this, 'paused').name('<b>*</b> Pause animate');
    }

    /**
     * Convenience for getting resources
     * @member {object}
     */
    get resources() {
        return this.loader.resources;
    }

    /**
     * Load resources
     * @param {object} manifest Collection of resources to load
     */
    load(manifest, callback) {
        this.loader.add(manifest).load(() => {
            callback();
            this.init();
            this.start();
        });
    }

    /**
     * Called when the load is completed
     */
    init() {

        const {resources} = this.loader;
        const {bounds, initWidth, initHeight} = this;

        // Setup the container
        this.pond = new PIXI.Container();
        this.pond.filterArea = this.filterArea;
        this.pond.filters = this.pondFilters;
        this.stage.addChild(this.pond);

        // Setup the background image
        this.bg = new PIXI.Sprite(resources.background.texture);
        this.pond.addChild(this.bg);

        // Create and add the fish
        for (let i = 0; i < 20; i++) {
            const id = 'fish' + ((i % 4) + 1);
            const fish = new PIXI.Sprite(resources[id].texture);
            fish.anchor.set(0.5);
            fish.filters = this.fishFilters;

            fish.direction = Math.random() * Math.PI * 2;
            fish.speed = 2 + Math.random() * 2;
            fish.turnSpeed = Math.random() - 0.8;

            fish.x = Math.random() * bounds.width;
            fish.y = Math.random() * bounds.height;

            fish.scale.set(0.8 + Math.random() * 0.3);
            this.pond.addChild(fish);
            this.fishes.push(fish);
        }

        // Setup the tiling sprite
        this.overlay = new PIXI.extras.TilingSprite(
            resources.overlay.texture,
            initWidth,
            initHeight
        );

        // Add the overlay
        this.pond.addChild(this.overlay);

        // Handle window resize event
        window.addEventListener('resize', this.resize.bind(this));
        this.resize();

        // Handle fish animation
        this.ticker.add(this.animate, this);
    }

    /**
     * Toggle fish moving
     */
    togglePause() {
        this.paused = !this.paused;
    }

    /**
     * Resize the demo when the window resizes
     */
    resize() {

        const {padding, bg, overlay, filterArea, bounds} = this;

        const width = this.domElement.offsetWidth;
        const height = this.domElement.offsetHeight;
        const filterAreaPadding = 4;

        // Use equivalent of CSS's contain for the background
        // so that it scales proportionally
        const bgAspect = bg.texture.width / bg.texture.height;
        const winAspect = width / height;

        if (winAspect > bgAspect) {
            bg.width = width;
            bg.height = width / bgAspect;
        }
        else {
            bg.height = height;
            bg.width = height * bgAspect;
        }

        bg.x = (width - bg.width) / 2;
        bg.y = (height - bg.height) / 2;

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

        this.events.emit('resize', width, height);

        this.renderer.resize(width, height);

        this.render();
    }

    /**
     * Animate the fish, overlay and filters (if applicable)
     * @param {number} delta - % difference in time from last frame render
     */
    animate(delta) {

        this.animateTimer += 0.1 * delta;

        const {bounds, animateTimer, overlay} = this;

        this.events.emit('animate', delta, animateTimer);

        if (this.paused) {
            return;
        }

        // Animate the overlay
        overlay.tilePosition.x = animateTimer * -10;
        overlay.tilePosition.y = animateTimer * -10;

        for (let i = 0; i < this.fishes.length; i++) {

            const fish = this.fishes[i];

            fish.direction += fish.turnSpeed * 0.01;

            fish.x += Math.sin(fish.direction) * fish.speed;
            fish.y += Math.cos(fish.direction) * fish.speed;

            fish.rotation = -fish.direction - Math.PI/2;

            if (fish.x < bounds.x) {
                fish.x += bounds.width;
            }
            if (fish.x > bounds.x + bounds.width) {
                fish.x -= bounds.width;
            }
            if (fish.y < bounds.y) {
                fish.y += bounds.height;
            }
            if (fish.y > bounds.y + bounds.height) {
                fish.y -= bounds.height;
            }

        }
    }

    /**
     * Add a new filter
     * @param {string} id Class name
     * @param {object|function} options The class name of filter or options
     * @param {string} [options.id] The name of the PIXI.filters class
     * @param {boolean} [options.global] Filter is in pixi.js
     * @param {array} [options.args] Constructor arguments
     * @param {boolean} [options.fishOnly=false] Apply to fish only, not whole scene
     * @param {boolean} [options.enabled=false] Filter is enabled by default
     * @param {boolean} [options.opened=false] Filter Folder is opened by default
     * @param {function} [oncreate] Function takes filter and gui folder as
     *        arguments and is scoped to the Demo application.
     * @return {PIXI.Filter} Instance of new filter
     */
    addFilter(id, options) {

        if (typeof options === 'function') {
            options = { oncreate: options };
        }

        options = Object.assign({
            name: id,
            enabled: false,
            opened: false,
            args: null,
            fishOnly: false,
            global: false,
            oncreate: null
        }, options);

        if (options.global) {
            options.name += ' (pixi.js)';
        }

        const folder = this.gui.addFolder(options.name);
        const ClassRef = PIXI.filters[id];

        if (!ClassRef) {
            throw `Unable to find class name with "${id}"`;
        }

        let filter;
        if (options.args) {
            const ClassRefArgs = function(a) {
                ClassRef.apply(this, a);
            };
            ClassRefArgs.prototype = ClassRef.prototype;
            filter = new ClassRefArgs(options.args);
        }
        else {
            filter = new ClassRef();
        }

        // Set enabled status
        filter.enabled = options.enabled;

        // Track enabled change with analytics
        folder.add(filter, 'enabled').onChange((enabled) => {
            ga('send', 'event', id, enabled ? 'enabled' : 'disabled');
            this.render();
            if (enabled) {
                folder.domElement.className += ' enabled';
            }
            else {
                folder.domElement.className = folder.domElement.className.replace(' enabled', '');
            }
        });

        if (options.opened) {
            folder.open();
        }

        if (options.enabled) {
            folder.domElement.className += ' enabled';
        }

        if (options.oncreate) {
            options.oncreate.call(filter, folder);
        }

        if (options.fishOnly) {
            this.fishFilters.push(filter);
        }
        else {
            this.pondFilters.push(filter);
        }

        return filter;
    }
}
