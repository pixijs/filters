import * as PIXI from 'pixi.js';

export default function() {
    const app = this;
    this.resources.map.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    const displacementSprite = new PIXI.Sprite(this.resources.map.texture);
    this.addFilter('DisplacementFilter', {
        enabled: true,
        global: true,
        args: [displacementSprite, this.initWidth, this.initHeight],
        oncreate(folder) {
            this.scale.x = 50;
            this.scale.y = 50;
            folder.add(this.scale, 'x', 1, 200).name('scale.x');
            folder.add(this.scale, 'y', 1, 200).name('scale.y');
            app.events.on('resize', (width, height) => {
                displacementSprite.width = width;
                displacementSprite.height = height;
            });
        }
    });
}