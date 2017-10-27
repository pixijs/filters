export default function() {
    this.addFilter('TiltShiftFilter', function(folder) {
        folder.add(this, 'blur', 0, 200);
        folder.add(this, 'gradientBlur', 0, 1000);
    });
}