export default function() {
    this.addFilter('OutlineFilter', {
        enabled: false,
        fishOnly: true,
        args: [4, 0x0, 0.25],
        oncreate(folder) {
            this.padding = this.thickness + 4;
            folder.add(this, 'thickness', 0, 10).onChange((value) => {
                this.padding = value + 4;
            });
            folder.addColor(this, 'color');
        }
    });
}