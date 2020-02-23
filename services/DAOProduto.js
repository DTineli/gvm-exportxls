const mysql = require("./mysql");

exports.getProdutos = async (grupo, tabela) => {
  const con = await mysql();

  const [
    rows
  ] = await con.query(
    "select p.referencia as referencia, p.descricao as descricao, t.valor as preco, p.peso_liquido as pesol, p.peso_bruto as pesob from variacao v left join produto p on v.fkproduto = p.recnum left join tabpreitem t on v.recnum = t.fkvariacao where p.fkgrupo = ? and fktabela = ? and v.situacao = 'A'",
    [grupo, tabela]
  );
  const produtos = [];
  rows.forEach(r => {
    produtos.push({
      ['Código']: r.referencia,
      ['Descrição']: r.descricao,
      ['Preço']: r.preco,
      ["Peso líquido (Kg)"]: r.pesol,
      ['Peso bruto (Kg)']: r.pesob,
    })
  });
  return produtos;
};

exports.insertProduto = async (produto, grupo, grade, tabela) => {
  const con = await mysql();
  if (produto["Código Pai"] !== "\t") {
  }
  const produtoDB = await con.query(
    "INSERT INTO produto (referencia, descricao, situacao, tipo, fkgrupo, fkgrade, utiliza_detalhes, peso_liquido, peso_bruto) VALUES (?,?,'A','P',?,?,0,?,?)",
    [
      produto["Código"],
      produto["Descrição"],
      grupo,
      grade,
      produto["Peso líquido (Kg)"],
      produto["Peso bruto (Kg)"]
    ]
  );

  const variacaoDb = await con.query(
    "insert into variacao (recnum,fkproduto,fkdetalhe,fkgradeitem,ult_alteracao,situacao) values (null,'?',null,null, now() ,'A')",
    [produtoDB[0].insertId]
  );

  const preco = await con.query(
    "insert into tabpreitem (recnum,fkvariacao,fktabela,alteracao,valor,valor_anterior,atualizacao) values (null,?,?,now(),?,'0',now())",
    [variacaoDb[0].insertId, tabela, produto["preço"]]
  );
};

exports.insertProdutos = async (produtos, grupo, grade, tabela) => {
  const errors = [];
  produtos.forEach(produto => {
    errors.push(this.insertProduto(produto, grupo, grade, tabela));
  });

  try {
    const result = await Promise.all(errors);
    return result;
  } catch (error) {
    console.log(error)
  }

};
