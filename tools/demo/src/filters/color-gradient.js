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
        opened: true,
        args: [stops, 1.0],
        oncreate(folder)
        {
            const onStopChange = () =>
            {
                this.stops = stops;
            };

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

            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'angle', -90, 90, 1);
        },
    });
}
