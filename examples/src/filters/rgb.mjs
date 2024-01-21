export default function ()
{
    this.addFilter('RGBSplitFilter', function (folder)
    {
        folder.add(this, 'redX', -20, 20).name('red.x');
        folder.add(this, 'redY', -20, 20).name('red.y');
        folder.add(this, 'blueX', -20, 20).name('blue.x');
        folder.add(this, 'blueY', -20, 20).name('blue.y');
        folder.add(this, 'greenX', -20, 20).name('green.x');
        folder.add(this, 'greenY', -20, 20).name('green.y');
    });
}
