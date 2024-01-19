const PIXI = require('pixi.js');

window.PIXI = PIXI;
const filters = require('../../lib');
const assert = require('assert');
const config = require('./config.json');
const base64ToImage = require('base64-to-image');
const { remote } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const GIFEncoder = require('gifencoder');

const sourceAssetSize = { width: 640, height: 320 };
const outputOptions = {
    path: path.join(__dirname, 'dist'),
    width: 280,
    height: 140,
    border: {
        color: 0xffffff,
        width: 10,
    },
};

const app = new PIXI.Application();

app.init({
    width: outputOptions.width,
    height: outputOptions.height,
    backgroundColor: outputOptions.border.color,
    autoStart: false,
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
    let displacement;
    let lightmap;
    let colormap;

    PIXI.Assets.addBundle('assets', [
        { alias: 'previewBackground', src: path.join(__dirname, 'assets', 'preview_background.png') },
        { alias: 'previewFishes', src: path.join(__dirname, 'assets', 'preview_fishes.png') },
        { alias: 'lightmap', src: path.join(__dirname, 'assets', 'lightmap.png') },
        { alias: 'displacement', src: path.join(__dirname, 'assets', 'displacement.png') },
        { alias: 'colormap', src: path.join(__dirname, 'assets', 'colormap.png') },
    ]);

    // Load image
    PIXI.Assets.loadBundle('assets').then((resources) =>
    {
        lightmap = resources.lightmap;
        colormap = resources.colormap;
        displacement = new PIXI.Sprite(resources.displacement);

        fishes = new PIXI.Sprite(resources.previewFishes);
        bg = new PIXI.Sprite(resources.previewBackground);

        fishes.scale.set(outputOptions.width / sourceAssetSize.width);
        bg.scale.set(outputOptions.width / sourceAssetSize.width);

        preview = new PIXI.Container();
        preview.addChild(bg, fishes);

        app.stage.addChild(preview);
        document.body.appendChild(app.canvas);
        next();
    });

    async function next()
    {
        const obj = config.images[++index];

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
            fishes.filters = [];
            preview.filters = [];

            if (obj.fishOnly)
            {
                fishes.filters = [filter];
            }
            else
            {
                preview.filters = [filter];
            }

            if (obj.filename)
            {
                const base64 = await app.renderer.extract.base64(app.stage);

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
                const canvas = app.renderer.extract.canvas(app.stage);
                const context = canvas.getContext('2d');

                context.scale(1, -1);
                const imageData = context.getImageData(0, 0, outputOptions.width, outputOptions.height);

                frames[obj.frame] = imageData.data;
            }

            // Wait for next stack to render next filter
            setTimeout(next, 0);
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
            setTimeout(nextAnim, 0);
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
            // close window
            const browserWindow = remote.getCurrentWindow();

            browserWindow.close();
        }
    }
});
