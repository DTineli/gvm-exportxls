const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

let importar = document.getElementById('btnImportar');

importar.addEventListener('click', () => {
  const arquivo = document.getElementById('inputArquivo');
  if (!arquivo.files[0]) {
    dialog.showMessageBox({
      type: 'warning',
      title: 'Atenção',
      message: 'Escolha um arquivo para importar !'
    });
    return
  }
  ipcRenderer.send('importar', arquivo.files[0].path);
});
