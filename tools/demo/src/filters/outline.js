export default function() {

    let thickness = window.localStorage.getItem('OutlineFilter.thickness');

    if (thickness === null) {
        thickness = undefined;
    }
    else {
        thickness = Number(thickness);
    }

    let quality = window.localStorage.getItem('OutlineFilter.quality');

    if (quality === null) {
        quality = undefined;
    }
    else {
        quality = Number(quality);
    }

    this.addFilter('OutlineFilter', {
        enabled: false,
        fishOnly: true,
        args: [thickness, undefined, quality],
        oncreate(folder) {
            const filter = this;

            filter.padding = filter.thickness + 4;

            folder.add(this, 'thickness', 0, 20).onChange(function(value) {
                value = Math.round(value);
                filter.thickness = value;
                filter.padding = value + 4;
                window.localStorage.setItem('OutlineFilter.thickness', value);
            });
            folder.addColor(this, 'color');

            folder.add(this, 'quality', 0, 1).onChange(function(value) {
                value = value.toFixed(2);
                window.localStorage.setItem('OutlineFilter.quality', value);
            });

            const tmp = {'tmp': ''};
            folder.add(tmp, 'tmp');

            const li = folder.__ul.querySelector('li:nth-child(6)');
            li.innerHTML = ' * `quality` needs to <a style=\'color:#ffffff\' href=\'javascript:window.location.reload()\'>Reload Page</a>';
        }
    });
}