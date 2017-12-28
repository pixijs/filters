export default function() {
    const app = this;
    app.addFilter('AdjustmentFilter', {
        enabled: false,
        global: false,
        opened: false,
        // args: [[app.initWidth / 2, app.initHeight / 2]],
        oncreate(folder) {
            folder.add(this, 'gamma', 0, 10);
            folder.add(this, 'saturation', 0, 10);
            folder.add(this, 'contrast', 0, 10);
            folder.add(this, 'brightness', 0, 10);
            folder.add(this, 'red', 0, 10);
            folder.add(this, 'green', 0, 10);
            folder.add(this, 'blue', 0, 10);
            folder.add(this, 'alpha', 0, 1);
            // folder.add(this, 'noise', 0, 1);
            // folder.add(this, 'noiseSize', 1, 10);
            // folder.add(this, 'scratch', -1, 1);
            // folder.add(this, 'scratchDensity', 0, 1);
            // folder.add(this, 'scratchWidth', 1, 20);
            // folder.add(this, 'vignetting', 0, 1);
            // folder.add(this, 'vignettingAlpha', 0, 1);
            // folder.add(this, 'vignettingBlur', 0, 1);
        }
    });
}
