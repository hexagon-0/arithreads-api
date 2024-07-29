import supertest from 'supertest';
import { app } from '../src/app';
import knex from '../src/database';

beforeAll(function () {
  return knex.migrate.latest();
});

afterAll(function () {
  return knex.destroy();
});

export const client = supertest(app);
