export default function() {
    this.addFilter('ShockwaveFilter', function(folder) {
        folder.add(this, 'time', 0, 1);
        folder.add(this.center, '0', 0, 1).name('center.x');
        folder.add(this.center, '1', 0, 1).name('center.y');
    });
}