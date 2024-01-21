export default function ()
{
    const app = this;
    const fillMode = 2; // LOOP

    app.addFilter('GlitchFilter', {
        args: {
            slices: 10,
            offset: 100,
            direction: 0,
            fillMode,
            average: false,
            red: { x: 2, y: 2 },
            green: { x: -10, y: 4 },
            blue: { x: 10, y: -4 },
            seed: 0.5,
        },
        oncreate(folder)
        {
            this.animating = true;

            app.events.on('animate', function ()
            {
                if (this.animating)
                {
                    this.seed = Math.random();
                }
            });

            folder.add(this, 'animating').name('(animating)');
            folder.add(this, 'seed', 0, 1);
            folder.add(this, 'slices', 2, 20).onChange((value) =>
            {
                this.slices = value >> 0;
            });
            folder.add(this, 'offset', -400, 400);
            folder.add(this, 'direction', -180, 180);

            const fillModeOptions = {
                TRANSPARENT: 0,
                ORIGINAL: 1,
                LOOP: 2,
                CLAMP: 3,
                MIRROR: 4,
            };

            folder.add(this, 'fillMode', fillModeOptions);

            folder.add(this.red, 'x', -50, 50).name('red.x');
            folder.add(this.red, 'y', -50, 50).name('red.y');
            folder.add(this.blue, 'x', -50, 50).name('blue.x');
            folder.add(this.blue, 'y', -50, 50).name('blue.y');
            folder.add(this.green, 'x', -50, 50).name('green.x');
            folder.add(this.green, 'y', -50, 50).name('green.y');
            folder.add(this, 'refresh');
        },
    });
}
