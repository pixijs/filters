export default function() {
    const app = this;
    app.addFilter('AdjustmentFilter', {
        oncreate(folder) {
            folder.add(this, 'gamma', 0, 5);
            folder.add(this, 'saturation', 0, 5);
            folder.add(this, 'contrast', 0, 5);
            folder.add(this, 'brightness', 0, 5);
            folder.add(this, 'red', 0, 5);
            folder.add(this, 'green', 0, 5);
            folder.add(this, 'blue', 0, 5);
            folder.add(this, 'alpha', 0, 1);
        }
    });
}
