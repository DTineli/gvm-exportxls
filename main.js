const { app, BrowserWindow, ipcMain } = require('electron');
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

  }


});

app.on('window-all-closed', () => {
  main = null;
  app.quit();
});
