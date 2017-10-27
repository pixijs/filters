export default function() {
    this.addFilter('ConvolutionFilter', {
        args: [[0,0,0,1,1,1,0,0,0], 300, 300],
        oncreate(folder) {
            folder.add(this, 'width', 0, 500);
            folder.add(this, 'height', 0, 500);
        }
    });
}