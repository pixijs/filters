export default function() {
    this.addFilter('BloomFilter', function(folder) {
        folder.add(this, 'blur', 0, 20);
        folder.add(this, 'blurX', 0, 20);
        folder.add(this, 'blurY', 0, 20);
    });
}