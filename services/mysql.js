const mysql = require('mysql2');
const ini = require('../iniHelper').GVM;

const con = mysql.createConnection({
  host: ini.Host,
  port: ini.Port,
  user: ini.User,
  database: ini.Schema,
  password: 'gvmsistemas#'
});

module.exports = con;
