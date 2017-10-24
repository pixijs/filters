export default function() {
    this.addFilter('EmbossFilter', function(folder) {
        folder.add(this, 'strength', 0, 20);
    });
}