const deepCopy = (value) => JSON.parse(JSON.stringify(value));
const { ColorGradientFilter } = PIXI.filters;

export default function ()
{
    let stops = deepCopy(ColorGradientFilter.defaults.stops);
    const ctrlIndex = {
        enabled: 0,
        resetOptions: 1,
        cssGradient: 2,
        type: 3,
        alpha: 4,
        angle: 5,
        maxColors: 6,
    };

    this.addFilter('ColorGradientFilter', {
        enabled: false,
        fishOnly: true,
        args: ctrlIndex,
        oncreate(folder)
        {
            let miscControls = {};

            const removeColorStopControllers = () =>
            {
                for (let i = folder.controllers.length - 1; i > 0; i--)
                {
                    if (folder.controllers[i]._name.includes('stop'))
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

                for (let i = 0; i < stops.length; i++)
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

                const canRemoveStops = (stops.length > 2);

                folder.add(miscControls, 'remove color stop').disable(!canRemoveStops);
                folder.add(miscControls, 'add color stop');
            };

            const setColorStops = (newStops, scaleOffsets = false) =>
            {
                if (scaleOffsets)
                {
                    const scaleFactor = (this.stops.length - 1) / (newStops.length - 1);
                    const lastIndexToScale = Math.min(newStops.length, this.stops.length);

                    for (let i = 0; i < lastIndexToScale; i++)
                    {
                        newStops[i].offset *= scaleFactor;
                    }
                }

                createColorStopControllers(newStops);
                stops = newStops;
                onStopChange();
            };

            const onCssGradientChange = (css) =>
            {
                let filter;

                const inputStyle = folder.controllers[ctrlIndex.cssGradient].domElement.style;

                inputStyle.border = '';

                if (css.trim().length === 0)
                {
                    return;
                }

                try
                {
                    filter = new ColorGradientFilter({ css });
                }
                catch (e)
                {
                    inputStyle.border = '2px solid red';

                    return;
                }

                folder.controllers[ctrlIndex.type].setValue(filter.type);
                folder.controllers[ctrlIndex.alpha].setValue(1.0);
                folder.controllers[ctrlIndex.angle].setValue(filter.angle);
                folder.controllers[ctrlIndex.maxColors].setValue(0);
                setColorStops(filter.stops, false);
            };

            const applyDefaultOptions = () =>
            {
                const defaults = deepCopy(ColorGradientFilter.defaults);

                folder.controllers[ctrlIndex.type].setValue(defaults.type);
                folder.controllers[ctrlIndex.alpha].setValue(defaults.alpha);
                folder.controllers[ctrlIndex.angle].setValue(defaults.angle);
                folder.controllers[ctrlIndex.maxColors].setValue(defaults.maxColors);
                folder.controllers[ctrlIndex.cssGradient].setValue('');
                setColorStops(defaults.stops, false);
            };

            const addColorStop = () =>
            {
                const getRandomColor = () => [0, 0, 0].map(Math.random);

                const newColorStop = {
                    offset: 1.0,
                    alpha: 1.0,
                    color: getRandomColor(),
                };

                setColorStops([...this.stops].concat([newColorStop]), true);
            };

            const removeLastColorStop = () =>
            {
                const newStops = [...this.stops.slice(0, -1)];

                setColorStops(newStops, true);
            };

            miscControls = Object.assign(miscControls, {
                'reset options': applyDefaultOptions,
                'add color stop': addColorStop,
                'remove color stop': removeLastColorStop,
                cssGradient: '',
            });

            folder.add(miscControls, 'reset options');
            folder.add(miscControls, 'cssGradient').name('from CSS gradient').onChange(onCssGradientChange);
            folder.add(this, 'type', { LINEAR: 0, RADIAL: 1, CONIC: 2 });
            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'angle', 0, 360, 1);
            folder.add(this, 'maxColors', 0, 24, 1);
            folder.add(this, 'replace', false);
            applyDefaultOptions(stops);
        },
    });
}
