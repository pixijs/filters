export default function() {
    const app = this;

    let kernels = [4, 3, 2, 1];
    let pixelSize = [1, 1];

    app.addFilter('KawaseBlurFilter', {
        enabled: false,
        global: false,
        args: [kernels, pixelSize],
        oncreate(folder) {
            const filter = this;

            folder.add(kernels, '0', 0, 20).name('kernels[0]')
                .onChange(function() {
                    filter.kernels = kernels;
                });
            folder.add(kernels, '1', 0, 20).name('kernels[1]')
                .onChange(function() {
                    filter.kernels = kernels;
                });
            folder.add(kernels, '2', 0, 20).name('kernels[2]')
                .onChange(function() {
                    filter.kernels = kernels;
                });
            folder.add(kernels, '3', 0, 20).name('kernels[3]')
                .onChange(function() {
                    filter.kernels = kernels;
                });
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
