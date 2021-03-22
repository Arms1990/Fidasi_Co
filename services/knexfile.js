module.exports = {
    development: {
      client: 'postgresql',
      connection: {
        host: process.env.DATABASE_HOSTNAME,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'migrations',
        schemaName: 'public',
        directory: './database/migrations'
      },
      seeds: {
        directory: './database/seeds'
      }
    },
  
    staging: {
      client: 'postgresql',
      connection: {
        host: process.env.DATABASE_HOSTNAME,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'migrations',
        schemaName: 'public',
        directory: './database/migrations'
      },
      seeds: {
        directory: './database/seeds'
      }
    },
  
    production: {
      client: 'postgresql',
      connection: {
        host: process.env.DATABASE_HOSTNAME,
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'migrations',
        schemaName: 'public',
        directory: './database/migrations'
      },
      seeds: {
        directory: './database/seeds'
      }
    }
  
  };