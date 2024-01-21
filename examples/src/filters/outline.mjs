export default function ()
{
    this.addFilter('OutlineFilter', {
        enabled: false,
        fishOnly: true,
        args: { thickness: 4, color: 0x0, quality: 0.25, alpha: 1.0, knockout: false },
        oncreate(folder)
        {
            folder.add(this, 'thickness', 0, 10);
            folder.addColor(this, 'color');
            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'knockout');
        },
    });
}
