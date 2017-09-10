require('pixi.js');
require('pixi-filters');
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

// Load image
app.loader.add('bars', path.join(__dirname, 'assets', 'bars.png'))
    .load((loader, resources) => {
        sprite = new PIXI.Sprite(resources.bars.texture);
        sprite.scale.set(0.5);
        sprite.anchor.set(0.5);
        sprite.position.set(app.view.width / 2, app.view.height / 2);
        app.stage.addChild(sprite);
        document.body.appendChild(app.view);
        next();
    });


function next() {
    const obj = config.images[++index];
    if (obj) {

        const FilterClass = PIXI.filters[obj.name];
        assert(!!FilterClass, `Filter ${obj.name} does not exist`);
        const filter = new FilterClass();
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
        sprite.rotation = 0;
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
            sprite.rotation = PIXI.DEG_TO_RAD * 180;
            app.render();
            frames[obj.frame] = app.renderer.plugins.extract.pixels();
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
        encoder.setDelay(500);  // frame delay in ms 
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