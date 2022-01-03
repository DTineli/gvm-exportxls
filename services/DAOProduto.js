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

exports.insertProduto = async (produto, grupo, grade, tabela, fornecedor) => {
  const con = await mysql();

  let grupoId = grupo;
  if (grupoId === "") {
    const descricao = `IMPORTAÇÃO - ${new Date()}`
    const grupo = await con.query(
      "INSERT INTO grupo (descricao, ordem, ult_alteracao, entra_boletim, situacao) VALUE ('?', 0, now(), 0, 'A')",
      [
        descricao,
      ]
    );

    grupoId = grupo.id;
  }
  const produtoDB = await con.query(
    "INSERT INTO produto (referencia, descricao, situacao, tipo, fkgrupo, fkgrade, utiliza_detalhes, peso_liquido, peso_bruto, descricao_site, descricao_nfe) VALUES (?,?,'A','P',?,?,0,?,?,?,?)",
    [
      produto["Código"],
      produto["Descrição"],
      grupoId,
      grade,
      produto["Peso líquido (Kg)"],
      produto["Peso bruto (Kg)"],
      produto["Descrição"],
      produto["Descrição"]
    ]
  );

  const variacaoDb = await con.query(
    "insert into variacao (recnum,fkproduto,fkdetalhe,fkgradeitem,ult_alteracao,situacao) values (null,'?',null,null, now() ,'A')",
    [produtoDB[0].insertId]
  );

  await con.query(
    "INSERT INTO produtocontato (fkproduto, fkcontato, principal, ult_alteracao) VALUES ?, ?, 1, now()",
    [
      produto[0].insertId,
      fornecedor,
  ]
  );

  await con.query(
    "insert into tabpreitem (recnum,fkvariacao,fktabela,alteracao,valor,valor_anterior,atualizacao) values (null,?,?,now(),?,'0',now())",
    [variacaoDb[0].insertId, tabela, produto["preço"]]
  );
};

exports.insertProdutos = async (produtos, grupo, grade, tabela, fornecedor) => {
  const errors = [];
  produtos.forEach(produto => {
    errors.push(this.insertProduto(produto, grupo, grade, tabela, fornecedor));
  });

  try {
    const result = await Promise.all(errors);
    return result;
  } catch (error) {
    console.log(error)
  }

};
