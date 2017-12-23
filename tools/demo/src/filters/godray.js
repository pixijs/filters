export default function() {
    const app = this;

    this.addFilter('GodrayFilter', {
        enabled: false,
        opened: false,
        oncreate: function(folder) {
            const filter = this;

            this.light = 30;
            this.gain = 0.6;
            this.lacunarity = 2.75;

            filter.animating = true;

            let lightSource = [100, -100];

            app.events.on('enable', function(enabled) {
                if (enabled && filter.animating) {
                    filter.time = 0;
                }
            });

            app.events.on('animate', function() {
                if (filter.animating){
                    filter.time += app.ticker.elapsedMS / 1000;
                }
            });

            folder.add(this, 'animating').name('(animating)');
            folder.add(this, 'time', 0, 1);
            folder.add(this, 'light', -60, 60).name('light(angle)');

            folder.add(lightSource, '0', -100, app.initWidth + 100).name('light(source).x').onChange(function(value) {
                lightSource[0] = value;
                filter.light = lightSource;
            });
            folder.add(lightSource, '1', -1000, -100).name('light(source).y').onChange(function(value) {
                lightSource[1] = value;
                filter.light = lightSource;
            });

            folder.add(this, 'gain', 0, 1);
            folder.add(this, 'lacunarity', 0, 5);
        }
    });
}
