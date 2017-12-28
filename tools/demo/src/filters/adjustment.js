export default function() {
    const app = this;
    app.addFilter('AdjustmentFilter', {
        enabled: false,
        global: false,
        opened: false,
        fishOnly: true,
        oncreate(folder) {
            folder.add(this, 'gamma', 0, 10);
            folder.add(this, 'saturation', 0, 10);
            folder.add(this, 'contrast', 0, 10);
            folder.add(this, 'brightness', 0, 10);
            folder.add(this, 'red', 0, 10);
            folder.add(this, 'green', 0, 10);
            folder.add(this, 'blue', 0, 10);
            folder.add(this, 'alpha', 0, 1);
        }
    });
}
