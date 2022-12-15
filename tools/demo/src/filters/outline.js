export default function ()
{
    this.addFilter('OutlineFilter', {
        enabled: false,
        fishOnly: true,
        args: [4, 0x0, 0.25, 1.0],
        oncreate(folder)
        {
            folder.add(this, 'thickness', 0, 10);
            folder.addColor(this, 'color');
            folder.add(this, 'alpha', 0, 1);
        },
    });
}
