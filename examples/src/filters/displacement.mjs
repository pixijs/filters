export default function ()
{
    const app = this;

    this.resources.map.source.addressMode = 'repeat';
    const displacementSprite = new PIXI.Sprite(this.resources.map);

    this.addFilter('DisplacementFilter', {
        enabled: true,
        global: true,
        args: { sprite: displacementSprite, scale: 1, width: this.initWidth, height: this.initHeight },
        oncreate(folder)
        {
            const { uScale } = this.resources.filterUniforms.uniforms;

            uScale.x = 50;
            uScale.y = 50;
            folder.add(uScale, 'x', 1, 200).name('scale.x');
            folder.add(uScale, 'y', 1, 200).name('scale.y');
            app.events.on('resize', (width, height) =>
            {
                displacementSprite.width = width;
                displacementSprite.height = height;
            });
        },
    });
}
