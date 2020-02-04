export default function() {
    this.addFilter('ColorOverlayFilter', {
        fishOnly: true,
        args: [0xff0000],
        oncreate(folder) {
            folder.addColor(this, 'color');
        }
    });
}
