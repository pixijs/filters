export default function ()
{
    this.addFilter('GlowFilter', {
        fishOnly: true,
        args: {
            distance: 15,
            outerStrength: 2,
            innerStrength: 0,
            color: 0xffffff,
            quality: 0.2,
            knockout: false,
        },
        oncreate(folder)
        {
            folder.add(this, 'distance', 0, 20);
            folder.add(this, 'innerStrength', 0, 20);
            folder.add(this, 'outerStrength', 0, 20);
            folder.addColor(this, 'color');
            folder.add(this, 'quality', 0, 1);
            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'knockout');
        },
    });
}
