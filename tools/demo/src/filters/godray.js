export default function() {
    const app = this;

    this.addFilter('GodrayFilter', {
        enabled: false,
        opened: false,
        oncreate: function(folder) {
            const filter = this;

            this.angle = 30;
            this.gain = 0.5;
            this.lacunarity = 2.5;

            filter.animating = true;

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
            folder.add(this, 'angle', -60, 60);
            folder.add(this, 'gain', 0, 1);
            folder.add(this, 'lacunarity', 0, 5);
        }
    });
}
