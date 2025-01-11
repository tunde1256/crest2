import { Knex } from 'knex';

exports.up = async function(knex: Knex): Promise<void> {
  await knex.schema.createTable('cards', (table) => {
    table.string('id', 36).primary(); // Remove the UUID() function from default
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.string('column_id', 36).notNullable();
    table.date('due_date');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('cards');
};
