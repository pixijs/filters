export default function() {
    const app = this;

    app.addFilter('MotionBlurFilter', {
        enabled: false,
        global: false,
        args: [[40, 40], 15],
        oncreate(folder) {
            const filter = this;

            folder.add(filter.velocity, 'x', -90, 90).name('velocity.x');
            folder.add(filter.velocity, 'y', -90, 90).name('velocity.y');
            folder.add(filter, 'kernelSize', [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]).name('kernelSize');
            folder.add(filter, 'offset', -150, 150).name('offset');
        }
    });
}
