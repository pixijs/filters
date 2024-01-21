export default function ()
{
    this.addFilter('SimpleLightmapFilter', {
        args: { lightMap: this.resources.lightmap, color: 0x666666 },
        oncreate(folder)
        {
            folder.addColor(this, 'color');
            folder.add(this, 'alpha', 0, 1);

            // eslint-disable-next-line no-empty-function
            this._noop = function () {};
            folder.add(this, '_noop').name('<img src="./images/lightmap.png" width="220" height="13">');
        },
    });
}
