export default function ()
{
    this.addFilter('HslAdjustmentFilter', {
        enabled: true,
        fishOnly: true,
        args: [],
        oncreate(folder)
        {
            folder.add(this, 'hue', -180, 180);
            folder.add(this, 'saturation', -1, 1);
            folder.add(this, 'lightness', -1, 1);
            folder.add(this, 'colorize');
            folder.add(this, 'alpha', 0, 1);
        },
    });
}
