export default function() {
    this.addFilter('ColorReplaceFilter', function(folder) {
        folder.addColor(this, 'originalColor');
        folder.addColor(this, 'newColor');
        folder.add(this, 'epsilon', 0, 1);
    });
}