export default function ()
{
    const app = this;

    app.addFilter('KawaseBlurFilter', {
        args: { strength: 4, quality: 3, clamp: true },
        oncreate(folder)
        {
            folder.add(this, 'strength', 0, 20);
            folder.add(this, 'quality', 1, 20);
            folder.add(this, 'pixelSizeX', 0, 10).name('pixelSize.x');
            folder.add(this, 'pixelSizeY', 0, 10).name('pixelSize.y');
        },
    });
}
