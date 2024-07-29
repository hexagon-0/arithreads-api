import knex, { Knex } from 'knex';
import { development, test, production } from './environment';

export type Environments = {
  development: Knex.Config,
  test: Knex.Config,
  production: Knex.Config,
}

export const configs = { development, test, production };

function isValidEnvironment (e: string): e is keyof Environments {
  return e === 'development' || e === 'test' || e === 'production';
}

function getConfig (environment: string) {
  if (isValidEnvironment(environment)) {
    return configs[environment];
  }

  throw new Error(`No configuration for environment ${environment}`);
}

const knexInstance = knex(getConfig(process.env.NODE_ENV || 'production'));

export default knexInstance;
