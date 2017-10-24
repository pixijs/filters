export default function() {
    this.addFilter('ColorMatrixFilter', {
        global: true,
        oncreate(folder) {
            folder.add(this, 'reset');
            folder.add(this, 'sepia');
            folder.add(this, 'negative');
            folder.add({kodachrome: this.kodachrome.bind(this, true)}, 'kodachrome');
            folder.add({lsd: this.lsd.bind(this, true)}, 'lsd');
            folder.add(this, 'polaroid');
            folder.add(this, 'desaturate');
            folder.add({contrast: this.contrast.bind(this, 1)}, 'contrast');
            folder.add({greyscale: this.greyscale.bind(this, 1)}, 'greyscale');
            folder.add({predator: this.predator.bind(this, 1)}, 'predator');
            folder.add({saturate: this.saturate.bind(this, 1)}, 'saturate');
        }
    });
}