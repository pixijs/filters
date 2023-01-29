export default function ()
{
    this.addFilter('DropShadowFilter', {
        fishOnly: true,
        oncreate(folder)
        {
            folder.add(this, 'blur', 0, 20);
            folder.add(this, 'quality', 0, 20);
            folder.add(this, 'alpha', 0, 1);
            folder.add(this.offset, 'x', -50, 50).name('offset.x');
            folder.add(this.offset, 'y', -50, 50).name('offset.y');
            folder.addColor(this, 'color');
            folder.add(this, 'shadowOnly');
        },
    });
}
