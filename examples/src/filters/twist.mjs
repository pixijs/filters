export default function ()
{
    const app = this;

    this.addFilter('TwistFilter', function (folder)
    {
        this.offsetX = app.initWidth / 2;
        this.offsetY = app.initHeight / 2;
        folder.add(this, 'angle', -10, 10);
        folder.add(this, 'radius', 0, app.initWidth);
        folder.add(this, 'offsetX', 0, app.initWidth);
        folder.add(this, 'offsetY', 0, app.initHeight);
    });
}
