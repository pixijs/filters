export default function ()
{
    const app = this;
    const height = app.initHeight;
    const width = app.initWidth;

    this.addFilter('TiltShiftFilter', {
        args: { start: { x: 0, y: height / 2 }, end: { x: width, y: height / 2 } },
        oncreate(folder)
        {
            folder.add(this, 'blur', 0, 200);
            folder.add(this, 'gradientBlur', 0, 1000);
            folder.add(this, 'startX', 0, width);
            folder.add(this, 'startY', 0, height);
            folder.add(this, 'endX', 0, width);
            folder.add(this, 'endY', 0, height);
        }
    });
}
