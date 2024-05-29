const mysql = require('mysql2/promise');

const connectionPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cleferdev',
  namedPlaceholders: true 
});

module.exports = connectionPool;