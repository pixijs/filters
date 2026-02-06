export default function ()
{
    this.addFilter('ColorReplaceFilter', function (folder)
    {
        const tColor = {
            targetColor: new PIXI.Color(this.targetColor).toRgbArray(),
            targetAlpha: 1,
        };
        const updateTarget = () => {
            this.targetColor = [...tColor.targetColor, tColor.targetAlpha];
        }

        folder.addColor(this, 'originalColor');
        folder.addColor(tColor, 'targetColor').onChange(() => updateTarget());
        folder.add(tColor, 'targetAlpha', 0, 1).name("targetColor alpha").onChange(() => updateTarget());
        folder.add(this, 'tolerance', 0, 1);
    });
}
