export default function() {
    this.addFilter('DotFilter', function(folder) {
        folder.add(this, 'scale', 0.3, 1);
        folder.add(this, 'angle', 0, 5);
    });
}