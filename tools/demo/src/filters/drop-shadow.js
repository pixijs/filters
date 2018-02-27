export default function() {
    this.addFilter('DropShadowFilter', {
        fishOnly: true,
        oncreate(folder) {
            folder.add(this, 'blur', 0, 20);
            folder.add(this, 'quality', 0, 20);
            folder.add(this, 'alpha', 0, 1);
            folder.add(this, 'distance', 0, 50);
            folder.add(this, 'rotation', 0, 360);
            folder.addColor(this, 'color');
            folder.add(this, 'shadowOnly');
        }
    });
}
