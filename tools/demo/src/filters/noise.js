export default function() {
    this.addFilter('NoiseFilter', {
        global: true,
        oncreate(folder) {
            folder.add(this, 'noise', 0, 1);
            folder.add(this, 'seed', 0.01, 0.99);
        }
    });
}