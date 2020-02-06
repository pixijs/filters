export default function() {
    this.addFilter('GlowFilter', {
        fishOnly: true,
        args: [{
            distance: 15,
            outerStrength: 2,
            innerStrength: 0,
            color: 0xffffff,
            quality: 0.2,
        }],
        oncreate(folder) {
            folder.add(this, 'innerStrength', 0, 20);
            folder.add(this, 'outerStrength', 0, 20);
            folder.addColor(this, 'color');
        }
    });
}
