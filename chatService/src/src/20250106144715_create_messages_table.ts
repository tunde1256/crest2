import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Your migration logic to create the table
  await knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();
    table.string('content');
    table.integer('sender_id');
    table.integer('receiver_id');
    table.timestamp('sent_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  // Logic to undo the migration (e.g., drop the table)
  await knex.schema.dropTableIfExists('messages');
}
