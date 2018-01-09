export default function() {
    this.addFilter('AdvancedBloomFilter', function(folder) {
        folder.add(this, 'threshold', 0.1, 0.9);
        folder.add(this, 'bloomScale', 0.5, 1.5);
        folder.add(this, 'brightness', 0.5, 1.5);
        folder.add(this, 'blur', 0, 20);
        folder.add(this, 'quality', 0, 20);
    });
}