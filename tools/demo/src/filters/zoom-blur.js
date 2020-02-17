export default function() {
    const app = this;
    this.addFilter('ZoomBlurFilter', {
        args: [{
            strength: 0.1,
            center: [app.initWidth / 2, app.initHeight / 2],
            innerRadius: 80
        }],
        oncreate(folder) {
            folder.add(this, 'strength', 0.01, 0.5);
            folder.add(this.center, '0', 0, app.initWidth).name('center.x');
            folder.add(this.center, '1', 0, app.initHeight).name('center.y');
            folder.add(this, 'innerRadius', 0, app.initWidth / 2);
        }
    });
}