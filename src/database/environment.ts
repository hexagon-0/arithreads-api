import { Knex } from 'knex';
import path from 'path';

export const development: Knex.Config = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: path.resolve(__dirname, '..', '..', 'database.db'),
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
  },
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
  ...development,
};
