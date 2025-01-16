export default function ()
{
    const app = this;

    app.addFilter('ReflectionFilter', {
        oncreate(folder)
        {
            const filter = this;

            filter.animating = true;

            app.events.on('enable', function (enabled)
            {
                if (enabled && filter.animating)
                {
                    filter.time = 0;
                }
            });

            app.events.on('animate', function ()
            {
                if (filter.animating)
                {
                    filter.time += 0.1;
                }
            });

            folder.add(this, 'animating').name('(animating)');

            folder.add(this, 'mirror');
            folder.add(this, 'boundary', 0, 1);
            folder.add(this, 'amplitudeStart', 0, 50).name('amplitude.start');
            folder.add(this, 'amplitudeEnd', 0, 50).name('amplitude.end');
            folder.add(this, 'wavelengthStart', 10, 200).name('waveLength.start');
            folder.add(this, 'wavelengthEnd', 10, 200).name('waveLength.end');
            folder.add(this, 'alphaStart', 0, 1).name('alpha.start');
            folder.add(this, 'alphaEnd', 0, 1).name('alpha.end');
            folder.add(this, 'time', 0, 20);
        },
    });
}
