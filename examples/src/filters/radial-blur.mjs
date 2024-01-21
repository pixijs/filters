export default function ()
{
    const app = this;

    app.addFilter('RadialBlurFilter', {
        args: { angle: 20, center: { x: app.initWidth / 2, y: app.initHeight / 2 }, kernelSize: 15, radius: 300 },
        enabled: false,
        oncreate(folder)
        {
            folder.add(this, 'angle', -180, 180);
            folder.add(this, 'centerX', 0, app.initWidth).name('center.x');
            folder.add(this, 'centerY', 0, app.initHeight).name('center.y');
            folder.add(this, 'radius', -1, Math.max(app.initWidth, app.initHeight));
            folder.add(this, 'kernelSize', [3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25]).name('kernelSize');
        },
    });
}
