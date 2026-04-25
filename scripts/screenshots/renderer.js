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

    const container = new Container();
    app.stage.addChild(container);

    const sprite = new Sprite.from('https://pixijs.io/examples/examples/assets/bunny.png');
    container.addChild(sprite);

    const filter = new filters.DropShadowFilter({
        color: 0x000000,
        blur: 2,
        quality: 2,
        distance: 5,
        alpha: 0.5,
        knockout: false,
    });

    sprite.filters = [filter];

    app.start();

    // Render frames
    const renderFrames = async () =>
    {
        for (let i = 0; i < 10; i++)
        {
            await new Promise(resolve => setTimeout(resolve, 1000 / 60));
            app.render();
            const frame = app.view;
            frames[i] = frame;
        }

        // Create GIF
        const encoder = new GIFEncoder(outputOptions.width, outputOptions.height);
        encoder.start();
        encoder.setQuality(10);
        encoder.setDelay(1000 / 60);

        for (let i = 0; i < 10; i++)
        {
            encoder.addFrame(frames[i]);
        }

        encoder.end();

        // Save GIF
        const gif = encoder.out.getData();
        fs.writeFileSync(path.join(outputOptions.path, 'screenshot.gif'), gif);

        // Close app
        ipcRenderer.send('screenshots-done');
    };

    renderFrames();
});