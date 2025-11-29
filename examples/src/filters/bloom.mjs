export default function ()
{
    this.addFilter('BloomFilter', function (folder)
    {
        const strength = { value: this.strengthX };

        folder.add(strength, 'value', 0, 20).onChange((value) =>
        {
            this.strengthX = value;
            this.strengthY = value;
        });
        folder.add(this, 'strengthX', 0, 20);
        folder.add(this, 'strengthY', 0, 20);
    });
}
