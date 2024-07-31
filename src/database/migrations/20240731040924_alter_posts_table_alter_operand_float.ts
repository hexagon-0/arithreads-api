import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', table => {
    table.float('operand').alter({ alterType: true });
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('posts', table => {
    table.decimal('operand', 4).alter({ alterType: true });
  });
}

