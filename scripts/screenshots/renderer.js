const { Application, Assets, Container, Sprite, Texture, ...PIXI } = require('pixi.js');
const filters = require('../../lib');
const assert = require('assert');
const config = require('./config.json');
const base64ToImage = require('base64-to-image');
const { ipcRenderer } = require('electron');
const fs = require('fs-extra');
const path = require('node:path');
const GIFEncoder = require('gifencoder');

const sourceAssetSize = { width: 640, height: 320 };
const outputOptions = {
    path: path.join(__dirname, '..', '..', 'screenshots'),
    width: 280,
    height: 140,
    border: {
        color: 0xffffff,
        width: 10,
    },
};

const app = new Application();

app.init({
    width: outputOptions.width,
    height: outputOptions.height,
    backgroundColor: outputOptions.border.color,
    autoStart: false,
    preference: 'webgpu',
    useBackBuffer: true,
    hello: true,
}).then(() =>
{
    const frames = {};

    // Make sure directory exists
    fs.ensureDirSync(outputOptions.path);

    // Empty the directory
    fs.emptyDirSync(outputOptions.path);

    let index = -1;
    let preview;
    let bg;
    let fishes;
    let overlay;
    let displacement;
    let lightmap;
    let colormap;

    Assets.addBundle('assets', [
        { alias: 'previewBackground', src: path.join(__dirname, 'assets', 'preview_background.png') },
        { alias: 'previewFishes', src: path.join(__dirname, 'assets', 'preview_fishes.png') },
        { alias: 'lightmap', src: path.join(__dirname, 'assets', 'lightmap.png') },
        { alias: 'displacement', src: path.join(__dirname, 'assets', 'displacement.png') },
        { alias: 'colormap', src: path.join(__dirname, 'assets', 'colormap.png') },
    ]);

    // Load image
    Assets.loadBundle('assets').then((resources) =>
    {
        lightmap = resources.lightmap;
        colormap = resources.colormap;
        displacement = new Sprite(resources.displacement);

        fishes = new Sprite(resources.previewFishes);
        bg = new Sprite(resources.previewBackground);
        overlay = new Sprite(Texture.WHITE);

        fishes.scale.set(outputOptions.width / sourceAssetSize.width);
        bg.scale.set(outputOptions.width / sourceAssetSize.width);
        overlay.setSize(outputOptions.width - 60, outputOptions.height - 60);
        overlay.filterArea = new PIXI.Rectangle(
            -overlay.width / 2,
            -overlay.height / 2,
            overlay.width,
            overlay.height,
        );
        overlay.anchor.set(0.5);
        overlay.x = outputOptions.width / 2;
        overlay.y = outputOptions.height / 2;

        preview = new Container();
        preview.addChild(bg, fishes, overlay);

        app.stage.addChild(preview);
        next();
    });

    const onlyImages = config.images.filter((obj) => obj.only);
    const images = onlyImages.length ? onlyImages : config.images;

    if (onlyImages.length)
    {
        document.body.classList.add('only');
    }

    async function next()
    {
        const obj = images[++index];

        if (obj)
        {
            const FilterClass = filters[obj.name] || PIXI[obj.name];

            assert(!!FilterClass, `Filter ${obj.name} does not exist`);
            let filter;

            switch (obj.name)
            {
                case 'DisplacementFilter': {
                    filter = new FilterClass({ sprite: displacement, scale: 50 });
                    break;
                }
                case 'SimpleLightmapFilter': {
                    filter = new FilterClass({ lightMap: lightmap });
                    break;
                }
                case 'ColorMapFilter': {
                    filter = new FilterClass({ colorMap: colormap, nearest: false });
                    break;
                }
                default: {
                    const args = obj.arguments;

                    if (args)
                    {
                        filter = new FilterClass(args);
                    }
                    else
                    {
                        filter = new FilterClass();
                    }
                }
            }

            if (obj.options)
            {
                for (const i in obj.options)
                {
                    filter[i] = obj.options[i];
                }
            }

            // Call function
            if (obj.func && filter[obj.func])
            {
                filter[obj.func].apply(filter, obj.args);
            }

            // Render the filter
            fishes.filters = null;
            preview.filters = null;
            overlay.filters = null;
            overlay.visible = false;

            if (obj.overlayOnly)
            {
                overlay.filters = [filter];
                overlay.visible = true;
                Object.assign(overlay, obj.overlayOptions);
            }
            else if (obj.fishOnly)
            {
                fishes.filters = [filter];
            }
            else
            {
                preview.filters = [filter];
            }

            if (obj.filename)
            {
                app.render();
                const base64 = await app.renderer.extract.base64(app.stage);
                const img = new Image();

                img.src = base64;
                document.body.appendChild(img);

                // Save image
                base64ToImage(
                    base64,
                    outputOptions.path + path.sep, {
                        fileName: obj.filename,
                        type: 'png',
                    },
                );
            }
            else if (obj.frame)
            {
                app.render();
                const canvas = app.renderer.extract.canvas(app.stage);

                const canvas2 = document.createElement('canvas');

                canvas2.width = canvas.width;
                canvas2.height = canvas.height;

                document.body.appendChild(canvas);
                const context = canvas2.getContext('2d');

                context.drawImage(canvas, 0, 0);

                context.scale(1, -1);
                const imageData = context.getImageData(0, 0, outputOptions.width, outputOptions.height);

                frames[obj.frame] = imageData.data;
            }

            // Wait for next stack to render next filter
            requestAnimationFrame(next);
        }
        else
        {
            index = -1;
            nextAnim();
        }
    }

    // Combine a bunch of frames
    function nextAnim()
    {
        const anim = config.animations[++index];

        if (anim)
        {
            const encoder = new GIFEncoder(outputOptions.width, outputOptions.height);

            // Stream output
            encoder.createReadStream().pipe(fs.createWriteStream(
                path.join(outputOptions.path, `${anim.filename}.gif`),
            ));

            encoder.start();
            encoder.setRepeat(0); // 0 for repeat, -1 for no-repeat
            encoder.setDelay(anim.delay || 500); // frame delay in ms
            encoder.setQuality(10); // image quality. 10 is default.

            // Add the frames
            anim.frames.forEach((frame) =>
            {
                encoder.addFrame(frames[frame]);
                delete frames[frame];
            });

            encoder.finish();

            // Wait for next stack to render next animation
            requestAnimationFrame(nextAnim);
        }
        else
        {
            complete();
        }
    }

    function complete()
    {
        // Only close if debug is off
        if (document.location.search.indexOf('debug') === -1)
        {
            ipcRenderer.send('screenshots-done');
        }
    }
});
