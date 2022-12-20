export default function ()
{
    const stops = [
        { offset: 0.00, color: 0xff0000, alpha: 1.0 },
        { offset: 0.25, color: 0xffff00, alpha: 1.0 },
        { offset: 0.50, color: 0x00ff00, alpha: 1.0 },
        { offset: 0.75, color: 0x00ffff, alpha: 1.0 },
        { offset: 1.00, color: 0x0000ff, alpha: 1.0 },
    ];

    this.addFilter('ColorGradientFilter', {
        enabled: true,
        fishOnly: true,
        opened: true,
        args: [stops, 1.0],
        oncreate(folder)
        {
            folder.add(this, 'alpha', 0, 1);
        },
    });
}
