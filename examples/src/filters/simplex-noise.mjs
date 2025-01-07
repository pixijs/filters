export default function ()
{
    const app = this;

    app.addFilter('SimplexNoiseFilter', {
        oncreate(folder)
        {
            folder.add(this, 'strength', 0, 1).name('strength');
            folder.add(this, 'noiseScale', 0, 50).name('noise scale');
            folder.add(this, 'offsetX', 0, 5).name('offsetX');
            folder.add(this, 'offsetY', 0, 5).name('offsetY');
            folder.add(this, 'offsetZ', 0, 5).name('offsetZ');
            folder.add(this, 'step', -1, 1).name('step');
        },
    });
}
