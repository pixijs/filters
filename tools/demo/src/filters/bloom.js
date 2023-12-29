export default function ()
{
    this.addFilter('BloomFilter', function (folder)
    {
        folder.add(this, 'strengthX', 0, 20);
        folder.add(this, 'strengthY', 0, 20);
    });
}
