export default function ()
{
    this.addFilter('PixelateFilter', function (folder)
    {
        folder.add(this, 'sizeX', 4, 40).name('size.x');
        folder.add(this, 'sizeY', 4, 40).name('size.y');
    });
}
