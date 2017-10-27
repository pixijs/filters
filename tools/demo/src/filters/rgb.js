export default function() {
    this.addFilter('RGBSplitFilter', function(folder) {
        folder.add(this.red, '0', -20, 20).name('red.x');
        folder.add(this.red, '1', -20, 20).name('red.y');
        folder.add(this.blue, '0', -20, 20).name('blue.x');
        folder.add(this.blue, '1', -20, 20).name('blue.y');
        folder.add(this.green, '0', -20, 20).name('green.x');
        folder.add(this.green, '1', -20, 20).name('green.y');
    });
}