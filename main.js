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
ipcMain.on('importar', async (e, params) => {
  try {
    const workbook = XLSX.readFile(params.arquivo, {raw: true});
    console.log(workbook)
    const worksheet = workbook.Sheets['Sheet1'];
    const produtos = XLSX.utils.sheet_to_json(worksheet);
    const result = await DAO.insertProdutos(produtos, params.grupo, params.grade, params.tabela);
    console.log(result);
    return dialog.showMessageBox(main, {
      type: 'info',
      message: 'Produtos importados !',
      title: 'Sucesso!'
    })
  } catch (error) {
    console.log(error);
  }
});

const formaData = () => {
  const hj = new Date();

  return `${hj.getDate()}-${hj.getMonth() +
    1}-${hj.getFullYear()}-${hj.getHours()}-${hj.getMinutes()}-${hj.getMilliseconds()}`;
}

ipcMain.on('exportar', async (e, params) => {
  
  const produtos = await DAO.getProdutos(params.grupo, params.tabela);
  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet(produtos);
  XLSX.utils.book_append_sheet(workbook, worksheet);

  const nome = `c:/temp/produtos-${formaData()}.xls`;
  XLSX.writeFile(workbook, nome);
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
