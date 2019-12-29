const ini = require('ini');
const fs = require('fs');

try {
  const config = ini.parse(fs.readFileSync('./gvmshop.ini', 'utf-8'));

  module.exports = config;
} catch (error) {
  throw {
    type: 'error',
    title: 'Erro no INI',
    message: 'Arquivo INI não foi encontrado ou apresenta erros !'
  }

}
