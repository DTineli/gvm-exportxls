const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const XLSX = require('xlsx');
const DAO = require('./services/DAOProduto');

let main = null;
app.on('ready', () => {
  if (main) return;

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

let janelaErros = null;
ipcMain.on('importar', async (e, arquivo) => {
  const workbook = await XLSX.readFile(arquivo);
  const worksheet = workbook.Sheets['Worksheet'];

  const produtos = XLSX.utils.sheet_to_json(worksheet);

  try {
    const result = await DAO.insertProdutos(produtos);

  } catch (error) {
    console.log(error);
  }


});

const errorHandle = (e) => {
  let options = {
    type: 'error',
    message: e.message,
    title: e.title,
  };

  if (e.custom) {
    options.message = e.custom.message;
    options.title = e.custom.title;
  }

  dialog.showMessageBox(null, options).then(() => {
    if (e.custom.quit) {
      app.quit();
    }
  });
}

process.on('unhandledRejection', (e) => {
  errorHandle(e);
});

process.on('uncaughtException', (e) => {
  errorHandle(e);
});

app.on('window-all-closed', () => {
  main = null;
  janelaErros = null;
  app.quit();
});
