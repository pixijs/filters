export default function ()
{
    this.addFilter('ColorOverlayFilter', {
        fishOnly: true,
        args: [0xff0000, 0.5],
        oncreate(folder)
        {
            folder.addColor(this, 'color');
			folder.add(this, 'alpha', 0, 1);
        },
    });
}
