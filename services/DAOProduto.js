const mysql = require('./mysql');

exports.insertProduto = async (produto, grupo, grade, tabela) => {
  const con = await mysql();
  if(produto['Código Pai'] !== '\t'){
    
  }
  const produtoDB = await con.query("INSERT INTO produto (referencia, descricao, situacao, tipo, fkgrupo, fkgrade, utiliza_detalhes, peso_liquido, peso_bruto) VALUES (?,?,'A','P',?,?,0,?,?)",
    [
      produto['Código'],
      produto['Descrição'],
      grupo,
      grade,
      produto['Peso líquido (Kg)'],
      produto['Peso bruto (Kg)'],
    ]);

  const variacaoDb = await con.query("insert into variacao (recnum,fkproduto,fkdetalhe,fkgradeitem,ult_alteracao,situacao) values (null,'?',null,null, now() ,'a')",[
    produtoDB[0].insertId,
  ]);

  const preco = await con.query("insert into tabpreitem (recnum,fkvariacao,fktabela,alteracao,valor,valor_anterior,atualizacao) values (null,?,?,now(),?,'0',now())",
  [
    variacaoDb[0].insertId,
    tabela,
    produto['preço'],

  ]);
};

exports.insertProdutos = async (produtos, grupo, grade, tabela) => {
  const errors = [];
  produtos.forEach(async produto => {
    await this.insertProduto(produto, grupo, grade);
  });
};
