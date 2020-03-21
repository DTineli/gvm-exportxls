const { ipcRenderer } = require('electron');
const { dialog } = require('electron').remote;

let importar = document.getElementById('btnImportar');
const exportar = document.getElementById("btnExportar");

importar.addEventListener('click', () => {
  const arquivo = document.getElementById('inputArquivo');
  const grupo = document.getElementById('grupo');
  const fornecedor = document.getElementById('fornecedor');
  const grade = document.getElementById('grade');
  const tabela = document.getElementById('tabela');

  if (!arquivo.files[0] || grade.value === '' || fornecedor.value === '' || tabela.value === '') {
    dialog.showMessageBox({
      type: 'warning',
      title: 'Atenção',
      message: 'Escolha um arquivo para importar !'
    });
    return
  }
  ipcRenderer.send('importar', {
    arquivo: arquivo.files[0].path,
    grupo: grupo.value || "",
    grade: grade.value || '1',
    tabela: tabela.value,
    fornecedor: fornecedor.value,
  });
});

exportar.addEventListener("click", e => {
  const grupo = document.getElementById("grupoExportar");
  const tabela = document.getElementById("tabelaExportar");

  if (tabela.value === "") {
    dialog.showMessageBox({
      type: "warning",
      title: "Atenção",
      message: "Escolha uma tabela de preço e um grupo para exportar !"
    });
    return;
  }

  ipcRenderer.send("exportar", {
    grupo: grupo.value,
    tabela: tabela.value,
    fornecedor: fornecedor.value,
  });
});
