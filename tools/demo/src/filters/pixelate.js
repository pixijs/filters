export default function() {
    this.addFilter('PixelateFilter', function(folder) {
        folder.add(this.size, '0', 4, 40).name('size.x');
        folder.add(this.size, '1', 4, 40).name('size.y');
    });
}