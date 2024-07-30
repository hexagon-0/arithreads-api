import { Knex } from 'knex';
import path from 'path';

const migrations = {
  directory: path.resolve(__dirname, 'migrations'),
};

export const development: Knex.Config = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'database.db'),
  },
  migrations,
  pool: {
    afterCreate: function (conn: any, done: Function) {
      conn.run('PRAGMA foreign_keys = ON');
      done();
    }
  }
};

export const test: Knex.Config = {
  ...development,
  connection: ':memory:',
};

export const production: Knex.Config = {
  client: 'pg',
  connection: process.env.DB_CONNECTION_STRING || {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
  },
  migrations,
};
