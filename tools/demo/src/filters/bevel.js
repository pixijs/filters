export default function() {
    this.addFilter('BevelFilter', {
        fishOnly: true,
        oncreate(folder) {
            folder.add(this, 'rotation', 0, 360);
            folder.add(this, 'thickness', 0, 5);
            folder.addColor(this, 'lightColor');
            folder.add(this, 'lightAlpha', 0, 1);
            folder.addColor(this, 'shadowColor');
            folder.add(this, 'shadowAlpha', 0, 1);
        }
    });
}