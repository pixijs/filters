export default function() {
    const app = this;
    app.addFilter('OldFilmFilter', {
        enabled: false,
        global: false,
        opened: false,
        args: [[app.initWidth / 2, app.initHeight / 2]],
        oncreate(folder) {
            const filter = this;

            app.events.on('animate', function() {
                filter.seed = Math.random();
            });

            folder.add(this, 'sepia', 0, 1);
            folder.add(this, 'noise', 0, 1);
            folder.add(this, 'noiseSize', 1, 10);
            folder.add(this, 'scratch', -1, 1);
            folder.add(this, 'scratchDensity', 0, 1);
            folder.add(this, 'scratchWidth', 1, 20);
            folder.add(this, 'vignetting', 0, 1);
            folder.add(this, 'vignettingAlpha', 0, 1);
            folder.add(this, 'vignettingBlur', 0, 1);
        }
    });
}
