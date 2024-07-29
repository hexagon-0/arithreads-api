import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('posts', table => {
    table.bigIncrements('id', { primaryKey: true }).index();

    table.bigInteger('userId').notNullable()
      .references('id').inTable('users')
      .onUpdate('CASCADE').onDelete('RESTRICT');

    table.decimal('operand', 4).notNullable();

    table.string('operator', 4).nullable();

    table.bigInteger('parentPostId').nullable()
      .references('id').inTable('posts')
      .onUpdate('CASCADE').onDelete('RESTRICT');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('posts');
}
