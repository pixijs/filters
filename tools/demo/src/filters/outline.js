export default function() {
    this.addFilter('OutlineFilter', {
        fishOnly: true,
        oncreate(folder) {
            folder.add(this, 'thickness', 0, 20);
            folder.addColor(this, 'color');
        }
    });
}