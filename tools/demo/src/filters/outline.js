export default function ()
{
    this.addFilter('OutlineFilter', {
        enabled: false,
        fishOnly: true,
        args: [4, 0x0, 0.25],
        oncreate(folder)
        {
            folder.add(this, 'thickness', 0, 10);
            folder.addColor(this, 'color');
        },
    });
}
