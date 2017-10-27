export default function() {
    this.addFilter('GodrayFilter', function(folder) {
        folder.add(this, 'time', 0, 1);
        folder.add(this, 'angle', -60, 60);
        folder.add(this, 'gain', 0, 1);
        folder.add(this, 'lacunarity', 0, 5);
    });
}