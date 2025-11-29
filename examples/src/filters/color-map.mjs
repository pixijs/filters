export default function ()
{
    const colorMap = this.resources.colormap;

    this.addFilter('ColorMapFilter', {
        enabled: false,
        args: { colorMap },
        oncreate(folder)
        {
            folder.add(this, 'mix', 0, 1);
            folder.add(this, 'nearest');

            // eslint-disable-next-line no-empty-function
            this._noop = () => {};
            folder.add(this, '_noop').name('<img src="./images/colormap.png" width="220" height="13">');
        },
    });
}
