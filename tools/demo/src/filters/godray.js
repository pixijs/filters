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

            filter.manually = false;

            app.events.on('toggle', function(enabled) {
                filter.disabled = !enabled;
                if (enabled && !filter.manually) {
                    filter.time = 0;
                }
            });

            app.events.on('animate', function() {
                if (!filter.manually){
                    filter.time += app.ticker.elapsedMS / 1000;
                }
            });

            folder.add(this, 'manually').name(' * play manually');
            folder.add(this, 'time', 0, 1);
            folder.add(this, 'angle', -60, 60);
            folder.add(this, 'gain', 0, 1);
            folder.add(this, 'lacunarity', 0, 5);
        }
    });
}
