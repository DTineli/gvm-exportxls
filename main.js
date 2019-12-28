const fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron');

let main = null;
app.on('ready', () => {

  main = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  main.loadURL(`file://${__dirname}/app/index.html`);
  main.webContents.openDevTools();

  main.once('ready-to-show', () => {
    main.show();
  });

});

ipcMain.on('importar', (e, args) => {

});

app.on('window-all-closed', () => {
  app.quit();
});
