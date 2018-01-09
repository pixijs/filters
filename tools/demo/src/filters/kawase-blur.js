export default function() {
    const app = this;

    let pixelSize = [1, 1];

    app.addFilter('KawaseBlurFilter', {
        oncreate(folder) {
            const filter = this;

            folder.add(this, 'blur', 0, 20);
            folder.add(this, 'quality', 1, 20);

            folder.add(pixelSize, '0', 0, 10).name('pixelSize.x')
                .onChange(function() {
                    filter.pixelSize = pixelSize;
                });
            folder.add(pixelSize, '1', 0, 10).name('pixelSize.y')
                .onChange(function() {
                    filter.pixelSize = pixelSize;
                });
        }
    });
}
