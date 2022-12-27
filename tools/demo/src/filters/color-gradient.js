import { ColorGradientFilter } from '@pixi/filter-color-gradient';

const deepCopy = (value) => JSON.parse(JSON.stringify(value));

export default function ()
{
    let stops = deepCopy(ColorGradientFilter.defaults.stops);

    this.addFilter('ColorGradientFilter', {
        enabled: true,
        fishOnly: false,
        args: [],
        oncreate(folder)
        {
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

                folder.add(misc, 'remove color stop').disable(!canRemoveStops);
                folder.add(misc, 'add color stop');
            };

            // handle css gradient
            const onCssGradientChange = (value) =>
            {
                console.log('css gradient changed..');
            };

            // init
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

            const applyDefaultOptions = () =>
            {
                let index = 0;
                const ctrlIndex = {
                    enabled: index++,
                    resetButton: index++,
                    cssGradient: index++,
                    type: index++,
                    alpha: index++,
                    angle: index++,
                    maxColors: index++,
                };

                const defaults = deepCopy(ColorGradientFilter.defaults);

                folder.controllers[ctrlIndex.type].setValue(defaults.type);
                folder.controllers[ctrlIndex.alpha].setValue(defaults.alpha);
                folder.controllers[ctrlIndex.angle].setValue(defaults.angle);
                folder.controllers[ctrlIndex.maxColors].setValue(defaults.maxColors);
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

            const misc = {
                'reset options': applyDefaultOptions,
                'add color stop': addColorStop,
                'remove color stop': removeLastColorStop,
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
