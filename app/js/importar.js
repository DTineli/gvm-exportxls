const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

let importar = document.getElementById('btnImportar');

importar.addEventListener('click', () => {
  const arquivo = document.getElementById('inputArquivo');
  const grupo = document.getElementById('grupo');
  const grade = document.getElementById('grade');
  const tabela = document.getElementById('tabela');

  if (!arquivo.files[0] || grupo.value === '' || grade.value === '') {
    dialog.showMessageBox({
      type: 'warning',
      title: 'Atenção',
      message: 'Escolha um arquivo para importar !'
    });
    return
  }
  ipcRenderer.send('importar', {
    arquivo: arquivo.files[0].path,
    grupo: grupo.value,
    grade: grade.value,
    tabela: tabela.value,
  });
});
