const ini = require('ini');
const fs = require('fs');

const config = ini.parse(fs.readFileSync('./gvmshop.ini', 'utf-8'));

module.exports = config;
