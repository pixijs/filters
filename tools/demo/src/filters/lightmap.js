export default function ()
{
    this.addFilter('SimpleLightmapFilter', {
        args: [this.resources.lightmap, 0x666666],
        oncreate(folder)
        {
            folder.addColor(this, 'color');
            folder.add(this, 'alpha', 0, 1);
        },
    });
}
