export default function ()
{
    this.addFilter('ColorReplaceFilter', function (folder)
    {
        folder.addColor(this, 'originalColor');
        folder.addColor(this, 'targetColor');
        folder.add(this, 'tolerance', 0, 1);
    });
}
