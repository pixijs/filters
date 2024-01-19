export default function ()
{
    this.addFilter('ColorOverlayFilter', {
        fishOnly: true,
        args: { color: 0xff0000, alpha: 1 },
        oncreate(folder)
        {
            folder.addColor(this, 'color');
            folder.add(this, 'alpha', 0, 1);
        },
    });
}
