import type { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.bigIncrements('id', { primaryKey: true }).index();
    table.string('username', 20).notNullable().unique();
    table.string('password', 256).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
