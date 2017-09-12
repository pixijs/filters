const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const debug = process.argv.indexOf('--debug') > -1;

app.on('ready', () => {
    const main = new BrowserWindow({
        width: 800,
        height: 600,
        show: debug
    });

    main.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        search: debug ? 'debug' : '',
        slashes: true
    }));
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});
