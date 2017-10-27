export default function() {
    this.addFilter('AlphaFilter', {
        global: true,
        oncreate(folder) {
            folder.add(this, 'alpha', 0, 1);
        }
    });
}