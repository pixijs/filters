export default function() {

    const colorMap = this.resources.colormap.texture;

    this.addFilter('ColorAdjustFilter', {
        enabled: false,
        args: [colorMap, false],
        oncreate(folder) {
            folder.add(this, 'nearest');

            this._noop = function(){};
            folder.add(this, '_noop').name('<img src="./images/colormap.png" width="220" height="13">');
        }
    });
}
