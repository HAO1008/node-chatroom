var mysql = require('mysql')

var conn = mysql.createConnection ({
  host: 'localhost',
  user: 'node-test',
  password: '123456',
  database: 'node-test',
  port: '3306',
  multipleStatements:true
})

module.exports = conn