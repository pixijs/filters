// kawase-blur

FilterMakers.push(function(){
    var filter;

    var kernels = [4, 3, 2, 1];
    var pixelSize = [1, 1];
    filter = new PIXI.filters.KawaseBlurFilter(kernels, pixelSize);
    filter.enabled = false;
    var folder = gui.addFolder('KawaseBlurFilter');
    folder.add(filter, 'enabled').onChange(trackEvent.bind(folder));

    folder.add(kernels, '0', 0, 8).name('kernels[0]')
        .onChange(function() {
            filter.kernels = kernels;
        });
    folder.add(kernels, '1', 0, 8).name('kernels[1]')
        .onChange(function() {
            filter.kernels = kernels;
        });
    folder.add(kernels, '2', 0, 8).name('kernels[2]')
        .onChange(function() {
            filter.kernels = kernels;
        });
    folder.add(kernels, '3', 0, 8).name('kernels[3]')
        .onChange(function() {
            filter.kernels = kernels;
        });
    folder.add(pixelSize, '0', [0, 1, 2, 3, 4]).name('pixelSize.x')
        .onChange(function() {
            filter.pixelSize = pixelSize;
        });
    folder.add(pixelSize, '1', [0, 1, 2, 3, 4]).name('pixelSize.y')
        .onChange(function() {
            filter.pixelSize = pixelSize;
        });

    return filter;
});
