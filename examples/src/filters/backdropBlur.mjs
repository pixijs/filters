export default function ()
{
    this.addFilter('BackdropBlurFilter', {
        fishOnly: true,
        oncreate(folder)
        {
            folder.add(this, 'blur', 0, 100);
            folder.add(this, 'quality', 1, 10);
        },
    });
}
