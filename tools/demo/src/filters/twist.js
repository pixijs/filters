import * as PIXI from 'pixi.js';

export default function() {
    const app = this;
    this.addFilter('TwistFilter', function(folder) {
        this.offset = new PIXI.Point(app.initWidth / 2, app.initHeight / 2);
        folder.add(this, 'angle', -10, 10);
        folder.add(this, 'radius', 0, app.initWidth);
        folder.add(this.offset, 'x', 0, app.initWidth);
        folder.add(this.offset, 'y', 0, app.initHeight);
    });
}