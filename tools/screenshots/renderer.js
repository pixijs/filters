require('pixi.js');
require('pixi-filters');
const assert = require('assert');
const config = require('./config.json');
const base64ToImage = require('base64-to-image');
const {remote} = require('electron');
const fs = require('fs-extra');
const path = require('path');

const app = new PIXI.Application({
    width: 270,
    height: 161,
    backgroundColor: 0xFFFFFF,
    autoStart: false
});

const outputPath = path.join(__dirname, 'dist');

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
        sprite.position.set(10);
        app.stage.addChild(sprite);
        document.body.appendChild(app.view);
        next();
    });


function next() {
    const obj = config[++index];

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
            filter[obj.func]();
        }

        // Render the filter
        sprite.filters = [filter];
        app.render();

        // Save image
        base64ToImage(
            app.renderer.plugins.extract.base64(),
            outputPath + path.sep, {
                fileName: obj.filename, 
                type:'png'
            }
        );

        // Wait for next stack to render next filter
        setTimeout(next, 0);
    }
    else if (document.location.search.indexOf('debug') === -1) {
        // close window
        const browserWindow = remote.getCurrentWindow();
        browserWindow.close();
    }
}