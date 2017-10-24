export default function() {
    this.addFilter('BulgePinchFilter', function(folder) {
        folder.add(this, 'radius', 0, 1000);
        folder.add(this, 'strength', -1, 1);
        folder.add(this.center, '0', 0, 1).name('center.x');
        folder.add(this.center, '1', 0, 1).name('center.y');
    });
}