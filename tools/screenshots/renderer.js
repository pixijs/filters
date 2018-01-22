const PIXI = require('pixi.js');
const filters = require('pixi-filters');
const assert = require('assert');
const config = require('./config.json');
const base64ToImage = require('base64-to-image');
const {remote} = require('electron');
const fs = require('fs-extra');
const path = require('path');
const GIFEncoder = require('gifencoder');

const app = new PIXI.Application({
    width: 270,
    height: 161,
    backgroundColor: 0xFFFFFF,
    autoStart: false
});

const outputPath = path.join(__dirname, 'dist');
const frames = {};

// Make sure directory exists
fs.ensureDirSync(outputPath);

// Empty the directory
fs.emptyDirSync(outputPath);

let index = -1;
let sprite;
let displacement;
let lightmap;
let colormap;

// Load image
app.loader
    .add('preview', path.join(__dirname, 'assets', 'preview.png'))
    .add('lightmap', path.join(__dirname, 'assets', 'lightmap.png'))
    .add('displacement', path.join(__dirname, 'assets', 'displacement.png'))
    .add('colormap', path.join(__dirname, 'assets', 'colormap.png'))
    .load((loader, resources) => {
        lightmap = resources.lightmap.texture;
        colormap = resources.colormap.texture;
        displacement = new PIXI.Sprite(resources.displacement.texture);
        sprite = new PIXI.Sprite(resources.preview.texture);
        sprite.scale.set(0.5);
        sprite.anchor.set(0.5);
        sprite.x = app.view.width / 2;
        sprite.y = app.view.height / 2;
        sprite.filterArea = app.screen;
        app.stage.addChild(sprite);
        document.body.appendChild(app.view);
        next();
    });


function next() {
    const obj = config.images[++index];
    if (obj) {

        const FilterClass = filters[obj.name] || PIXI.filters[obj.name];
        assert(!!FilterClass, `Filter ${obj.name} does not exist`);
        let filter;
        switch(obj.name) {
            case 'DisplacementFilter': {
                filter = new FilterClass(displacement, 50);
                break;
            }
            case 'SimpleLightmapFilter': {
                filter = new FilterClass(lightmap);
                break;
            }
            case 'ColorAdjustFilter': {
                filter = new FilterClass(colormap, false);
                break;
            }
            default: {
                const args = obj.arguments;
                if (args) {
                    filter = new FilterClass(...args);
                }
                else {
                    filter = new FilterClass();
                }
            }
        }

        if (obj.options) {
            for (const i in obj.options) {
                filter[i] = obj.options[i];
            }
        }

        // Call function
        if (obj.func && filter[obj.func]) {
            filter[obj.func].apply(filter, obj.args);
        }

        // Render the filter
        sprite.scale.set(0.5);
        sprite.filters = [filter];

        if (obj.filename) {
            // Save image
            app.render();
            base64ToImage(
                app.renderer.plugins.extract.base64(),
                outputPath + path.sep, {
                    fileName: obj.filename,
                    type:'png'
                }
            );
        }
        else if (obj.frame) {
            app.render();
            const canvas = app.renderer.plugins.extract.canvas();
            const context = canvas.getContext('2d');
            context.scale(1, -1);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            frames[obj.frame] = imageData.data;
        }

        // Wait for next stack to render next filter
        setTimeout(next, 0);
    }
    else {
        index = -1;
        nextAnim();
    }
}

// Combine a bunch of frames
function nextAnim() {
    const anim = config.animations[++index];
    if (anim) {

        const encoder = new GIFEncoder(app.view.width, app.view.height);

        // Stream output
        encoder.createReadStream().pipe(fs.createWriteStream(
            path.join(outputPath, anim.filename + '.gif')
        ));

        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(anim.delay || 500);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.

        // Add the frames
        anim.frames.forEach((frame) => {
            encoder.addFrame(frames[frame]);
            delete frames[frame];
        });

        encoder.finish();

        // Wait for next stack to render next animation
        setTimeout(nextAnim, 0);
    }
    else {
        complete();
    }
}

function complete() {
    // Only close if debug is off
    if (document.location.search.indexOf('debug') === -1) {
        // close window
        const browserWindow = remote.getCurrentWindow();
        browserWindow.close();
    }
}
