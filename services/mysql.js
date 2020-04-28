const mysql = require('mysql2/promise');
const ini = require('../iniHelper').GVM;

const createCon = async () => {
  try {
    const con = await mysql.createConnection({
      host: ini.Host,
      port: ini.Port,
      user: ini.User,
      database: ini.Schema,
      password: 'gvmsistemas#'
    });

    return con;
  } catch (error) {
    error.custom = {
      title: 'Não foi possivel conectar com o banco de dados!',
      message: 'Não foi possivel conectar com o banco de dados! Verifique o serviço do mysql ou o gvmshop.ini',
      quit: true,
    }
    throw error;
  }
}


module.exports = createCon;
