export default function() {
    const app = this;
    let velocity = [40, 40];

    app.addFilter('MotionBlurFilter', {
        enabled: false,
        global: false,
        args: [velocity, 15],
        oncreate(folder) {
            const filter = this;

            folder.add(velocity, '0', -90, 90).name('velocity.x').onChange(function() {
                filter.velocity = velocity;
            });
            folder.add(velocity, '1', -90, 90).name('velocity.y').onChange(function() {
                filter.velocity = velocity;
            });
            folder.add(filter, 'kernelSize', [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]).name('kernelSize');
            folder.add(filter, 'offset', -150, 150).name('offset');

        }
    });
}
