export default function() {
    this.addFilter('GlowFilter', {
        fishOnly: true,
        args: [15, 2, 1, 0xffffff, 0.1],
        oncreate(folder) {
            folder.add(this, 'innerStrength', 0, 20);
            folder.add(this, 'outerStrength', 0, 20);
            folder.add(this, 'distance', 10, 20);
            folder.addColor(this, 'color');
        }
    });
}