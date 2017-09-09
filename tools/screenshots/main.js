const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

app.on('ready', () => {
    const main = new BrowserWindow({
        width: 800,
        height: 600,
        show: false
    });

    main.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});
