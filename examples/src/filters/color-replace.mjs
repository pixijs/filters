export default function ()
{
    this.addFilter('ColorReplaceFilter', function (folder)
    {
        const tColor = {
            targetColor: new PIXI.Color(this.targetColor).toRgbArray(),
            alpha: 1,
        };
        const updateTarget = () => { this.targetColor = [...tColor.targetColor, tColor.alpha]; };

        folder.addColor(this, 'originalColor');
        const target = folder.addFolder('Target Color');

        target.addColor(tColor, 'targetColor').onChange(() => updateTarget());
        target.add(tColor, 'alpha', 0, 1).name('↳ alpha').onChange(() => updateTarget());
        folder.add(this, 'tolerance', 0, 1);
        folder.add(this, 'smoothness', 0, 1);
    });
}
