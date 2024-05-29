module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: 3306,
        database: 'cleferdev', // Nama database Anda
        user: 'root', // Username database Anda
        password: '' // Password database Anda
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: 'app/database/migrations'
      }
    }
  };