export default function() {
    this.addFilter('AsciiFilter', function(folder) {
        folder.add(this, 'size', 2, 20);
    });
}