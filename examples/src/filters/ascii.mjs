export default function ()
{
    this.addFilter('AsciiFilter', function (folder)
    {
        folder.add(this, 'size', 2, 20);
        folder.addColor(this, 'color');
        folder.add(this, 'replaceColor');
    });
}
