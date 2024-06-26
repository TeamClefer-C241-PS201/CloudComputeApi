require('dotenv').config();
module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME, 
        user: process.env.DB_USER, 
        password: process.env.DB_PASSWORD 
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: 'app/database/migrations'
      },
      seeds: {
        directory: 'app/database/seeders' // Lokasi file seed
      }
    }
  };