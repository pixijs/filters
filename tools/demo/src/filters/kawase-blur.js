export default function() {
    const app = this;
    app.addFilter('KawaseBlurFilter', {
        args: [4, 3, true],
        oncreate(folder) {
            folder.add(this, 'blur', 0, 20);
            folder.add(this, 'quality', 1, 20);
            folder.add(this.pixelSize, 'x', 0, 10).name('pixelSize.x');
            folder.add(this.pixelSize, 'y', 0, 10).name('pixelSize.y');
        }
    });
}
