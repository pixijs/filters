export default function() {
    this.addFilter('ConvolutionFilter', {
        args: [[0,0.5,0,0.5,1,0.5,0,0.5,0], 300, 300],
        oncreate(folder) {
            folder.add(this, 'width', 0, 500);
            folder.add(this, 'height', 0, 500);
            for (let i = 0; i < this.matrix.length; i++) {
                folder.add(this.matrix, i, 0, 1, 0.01).name(`matrix[${i}]`);
            }
        }
    });
}