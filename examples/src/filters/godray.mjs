export default function ()
{
    const app = this;

    this.addFilter('GodrayFilter', {
        enabled: false,
        args: { center: { x: app.initWidth * 0.5, y: -100 } },
        oncreate(folder)
        {
            this.alpha = 1;
            this.light = 30;
            this.gain = 0.6;
            this.lacunarity = 2.75;
            this.animating = true;

            app.events.on('enable', (enabled) =>
            {
                if (enabled && this.animating)
                {
                    this.time = 0;
                }
            });

            app.events.on('animate', function ()
            {
                if (this.animating)
                {
                    this.time += app.ticker.elapsedMS / 1000;
                }
            });

            folder.add(this, 'animating').name('(animating)');
            folder.add(this, 'time', 0, 1);
            folder.add(this, 'gain', 0, 1);
            folder.add(this, 'lacunarity', 0, 5);
            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'parallel');
            folder.add(this, 'angle', -60, 60);
            folder.add(this, 'centerX', -100, app.initWidth + 100).name('center.x');
            folder.add(this, 'centerY', -1000, -100).name('center.y');
        },
    });
}
