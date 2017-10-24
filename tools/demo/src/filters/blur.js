export default function() {
    this.addFilter('BlurFilter', {
        global: true,
        oncreate(folder) {
            folder.add(this, 'blur', 0, 100);
            folder.add(this, 'quality', 1, 10);
        }
    });
}