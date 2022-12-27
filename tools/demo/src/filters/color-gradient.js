export default function ()
{
    const stops = [
        { offset: 0.00, color: 0xff0000, alpha: 1.0 },
        { offset: 0.50, color: 0x00ff00, alpha: 1.0 },
        { offset: 1.00, color: 0x0000ff, alpha: 1.0 },
    ];

    this.addFilter('ColorGradientFilter', {
        enabled: true,
        fishOnly: true,
        args: [{ stops }],
        oncreate(folder)
        {
            const removeColorStopControllers = () =>
            {
                for (let i = folder.controllers.length - 1; i > 0; i--)
                {
                    if (folder.controllers[i]._name.includes('stops['))
                    {
                        folder.controllers[i].destroy();
                    }
                }
            };

            const onStopChange = () =>
            {
                this.stops = stops;
            };

            const createColorStopControllers = (stops) =>
            {
                removeColorStopControllers();

                for (let i = 0; i < this.stops.length; i++)
                {
                    folder.addColor(stops[i], 'color')
                        .name(`stops[${i}].color`)
                        .onChange(onStopChange);
                    folder.add(stops[i], 'offset', 0, 1)
                        .name(`stops[${i}].offset`)
                        .onChange(onStopChange);
                    folder.add(stops[i], 'alpha', 0, 1)
                        .name(`stops[${i}].alpha`)
                        .onChange(onStopChange);
                }
            };

            // handle css gradient
            const onCssGradientChange = (value) =>
            {
                console.log('css gradient changed..');
            };

            // init
            const applyDefaultOptions = () =>
            {
                folder.reset();
                createColorStopControllers(stops);
            };

            const misc = {
                'reset options': applyDefaultOptions,
                cssGradient: '',
            };

            folder.add(misc, 'reset options');
            folder.add(misc, 'cssGradient').name('from CSS gradient').onChange(onCssGradientChange);
            folder.add(this, 'type', { LINEAR: 0, RADIAL: 1, CONIC: 2 });
            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'angle', -180, 180, 1);
            folder.add(this, 'maxColors', 0, 24, 1);

            applyDefaultOptions(stops);
        },
    });
}
