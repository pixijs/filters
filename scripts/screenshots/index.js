const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const url = require('node:url');

const debug = !!process.env.DEBUG_SCREENSHOTS;

app.whenReady().then(() =>
{
    const main = new BrowserWindow({
        width: 800,
        height: 600,
        show: debug,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    main.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        search: debug ? 'debug' : '',
        slashes: true,
    }));

    ipcMain.once('screenshots-done', () => main.close());
});

// Quit when all windows are closed.
app.on('window-all-closed', () =>
{
    app.quit();
});
