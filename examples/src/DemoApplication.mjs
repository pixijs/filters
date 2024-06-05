/** Demo show a bunch of fish and a lil-gui controls */
export default class DemoApplication extends PIXI.Application
{
    constructor()
    {
        const gui = new lil.GUI();

        gui.useLocalStorage = false;

        // Get the initial dementions for the application
        const domElement = document.querySelector('#container');
        const initWidth = domElement.offsetWidth;
        const initHeight = domElement.offsetHeight;

        super();

        this.domElement = domElement;
        this.resources = null;
        this.initWidth = initWidth;
        this.initHeight = initHeight;
        this.animating = true;
        this.rendering = true;
        this.events = new PIXI.EventEmitter();
        this.animateTimer = 0;
        this.bg = null;
        this.pond = null;
        this.fishCount = 20;
        this.fishes = [];
        this.fishFilters = [];
        this.pondFilters = [];

        this.filterArea = new PIXI.Rectangle();
        this.padding = 100;
        this.bounds = new PIXI.Rectangle(
            -this.padding,
            -this.padding,
            initWidth + (this.padding * 2),
            initHeight + (this.padding * 2),
        );

        this.enabledFilters = [];

        const app = this;

        this.gui = gui;
        this.gui.add(this, 'rendering')
            .name('&bull; Rendering')
            .onChange((value) =>
            {
                if (!value)
                {
                    app.stop();
                }
                else
                {
                    app.start();
                }
            });
        this.gui.add(this, 'animating')
            .name('&bull; Animating');
    }

    /** override init */
    init()
    {
        const preference = (new URLSearchParams(window.location.search)).get('preference') || 'webgpu';

        return super.init({
            hello: true,
            width: this.initWidth,
            height: this.initHeight,
            autoStart: false,
            preference,
            useBackBuffer: true,
        });
    }

    /**
     * Load resources
     * @param {object} manifest Collection of resources to load
     */
    async load(manifest)
    {
        PIXI.Assets.addBundle('bundle', manifest);
        this.resources = await PIXI.Assets.loadBundle('bundle');
        this.setup();
        this.start();
    }

    setup()
    {
        document.body.appendChild(this.canvas);

        const { resources } = this;
        const { bounds, initWidth, initHeight } = this;

        // Setup the container
        this.pond = new PIXI.Container();
        this.pond.filterArea = this.filterArea;
        this.stage.addChild(this.pond);

        // Setup the background image
        this.bg = new PIXI.Sprite(resources.background);
        this.pond.addChild(this.bg);

        // Create and add the fish
        const fishVariations = 5;

        for (let i = 0; i < this.fishCount; i++)
        {
            const id = `fish${(i % fishVariations) + 1}`;
            const fish = new PIXI.Sprite(resources[id]);

            fish.anchor.set(0.5);
            fish.filters = this.fishFilters;

            fish.direction = Math.random() * Math.PI * 2;
            fish.speed = 2 + (Math.random() * 2);
            fish.turnSpeed = Math.random() - 0.8;

            fish.x = Math.random() * bounds.width;
            fish.y = Math.random() * bounds.height;

            fish.scale.set(0.8 + (Math.random() * 0.3));
            this.pond.addChild(fish);
            this.fishes.push(fish);
        }

        // Setup the tiling sprite
        this.overlay = new PIXI.TilingSprite({
            texture: resources.overlay,
            width: initWidth,
            height: initHeight,
        });

        // Add the overlay
        this.pond.addChild(this.overlay);

        // Handle window resize event
        window.addEventListener('resize', this.handleResize.bind(this));
        this.handleResize();

        // Handle fish animation
        this.ticker.add(this.animate, this);
    }

    /**
     * Resize the demo when the window resizes
     */
    handleResize()
    {
        const { padding, bg, overlay, filterArea, bounds } = this;

        const width = this.domElement.offsetWidth;
        const height = this.domElement.offsetHeight;
        const filterAreaPadding = 0;

        // Use equivalent of CSS's contain for the background
        // so that it scales proportionally
        const bgAspect = bg.texture.width / bg.texture.height;
        const winAspect = width / height;

        if (winAspect > bgAspect)
        {
            bg.width = width;
            bg.height = width / bgAspect;
        }
        else
        {
            bg.height = height;
            bg.width = height * bgAspect;
        }

        bg.x = (width - bg.width) / 2;
        bg.y = (height - bg.height) / 2;

        overlay.width = width;
        overlay.height = height;

        bounds.x = -padding;
        bounds.y = -padding;
        bounds.width = width + (padding * 2);
        bounds.height = height + (padding * 2);

        filterArea.x = filterAreaPadding;
        filterArea.y = filterAreaPadding;
        filterArea.width = width - (filterAreaPadding * 2);
        filterArea.height = height - (filterAreaPadding * 2);

        this.events.emit('resize', width, height);

        this.renderer.resize(width, height);

        this.render();
    }

    /**
     * Animate the fish, overlay and filters (if applicable)
     * @param {number} delta - % difference in time from last frame render
     */
    animate(time)
    {
        const delta = time.deltaTime;

        this.animateTimer += delta;

        const { bounds, animateTimer, overlay } = this;

        this.events.emit('animate', delta, animateTimer);

        if (!this.animating)
        {
            return;
        }

        // Animate the overlay
        overlay.tilePosition.x = animateTimer * -1;
        overlay.tilePosition.y = animateTimer * -1;

        for (let i = 0; i < this.fishes.length; i++)
        {
            const fish = this.fishes[i];

            fish.direction += fish.turnSpeed * 0.01;
            fish.x += Math.sin(fish.direction) * fish.speed;
            fish.y += Math.cos(fish.direction) * fish.speed;

            fish.rotation = -fish.direction - (Math.PI / 2);

            if (fish.x < bounds.x)
            {
                fish.x += bounds.width;
            }
            if (fish.x > bounds.x + bounds.width)
            {
                fish.x -= bounds.width;
            }
            if (fish.y < bounds.y)
            {
                fish.y += bounds.height;
            }
            if (fish.y > bounds.y + bounds.height)
            {
                fish.y -= bounds.height;
            }
        }
    }

    /**
     * Add a new filter
     * @param {string} id Class name
     * @param {object|function} options The class name of filter or options
     * @param {string} [options.id] The name of the filter class
     * @param {boolean} [options.global] Filter is in pixi.js
     * @param {array} [options.args] Constructor arguments
     * @param {boolean} [options.fishOnly=false] Apply to fish only, not whole scene
     * @param {boolean} [options.enabled=false] Filter is enabled by default
     * @param {function} [oncreate] Function takes filter and gui folder as
     *        arguments and is scoped to the Demo application.
     * @return {Filter} Instance of new filter
     */
    addFilter(id, options)
    {
        if (typeof options === 'function')
        {
            options = { oncreate: options };
        }

        options = Object.assign({
            name: id,
            enabled: false,
            opened: false,
            args: undefined,
            fishOnly: false,
            global: false,
            oncreate: null,
        }, options);

        if (options.global)
        {
            options.name += ' (pixi.js)';
        }

        const app = this;
        const folder = this.gui.addFolder(options.name).close();
        const ClassRef = PIXI.filters[id] || PIXI[id];

        if (!ClassRef)
        {
            throw new Error(`Unable to find class name with "${id}"`);
        }

        const filter = new ClassRef(options.args);

        // Set enabled status
        filter.enabled = (options.enabled && this.enabledFilters.length === 0) || this.enabledFilters.includes(id);

        // TODO: This is a hack for the issue with the 'enabled' toggling
        // https://github.com/orgs/pixijs/projects/2/views/4?pane=issue&itemId=48582986
        const toggleFilter = (enabled) =>
        {
            if (options.fishOnly)
            {
                const fishFilters = [...this.fishFilters];

                if (enabled)
                {
                    fishFilters.push(filter);
                }
                else
                {
                    const index = fishFilters.indexOf(filter);

                    if (index !== -1) fishFilters.splice(index, 1);
                }
                this.fishFilters = fishFilters;
                this.fishes.forEach((fish) =>
                {
                    fish.filters = fishFilters;
                });
            }
            else
            {
                const pondFilters = [...this.pondFilters];

                if (enabled)
                {
                    pondFilters.push(filter);
                }
                else
                {
                    const index = pondFilters.indexOf(filter);

                    if (index !== -1) pondFilters.splice(index, 1);
                }

                this.pondFilters = pondFilters;
                // TODO: seems like a bug, requiring invalidation
                this.pond.filters = [];
                this.pond.filters = pondFilters;
            }
        };

        // Track enabled change with analytics
        folder.add(filter, 'enabled').onChange((enabled) =>
        {
            ga('send', 'event', id, enabled ? 'enabled' : 'disabled');

            toggleFilter(enabled);
            app.events.emit('enable', enabled);

            this.render();
            if (enabled)
            {
                folder.domElement.className += ' enabled';
            }
            else
            {
                folder.domElement.className = folder.domElement.className.replace(' enabled', '');
            }
        });

        if (filter.enabled)
        {
            folder.open();
            folder.domElement.className += ' enabled';
        }

        if (options.oncreate)
        {
            options.oncreate.call(filter, folder);
        }

        toggleFilter(filter.enabled);

        return filter;
    }
}
