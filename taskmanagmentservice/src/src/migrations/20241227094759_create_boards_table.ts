import { Knex } from 'knex';  // Import the Knex types

exports.up = async function (knex: Knex) {  // Explicitly type the knex parameter
  await knex.schema.createTable('boards', (table: Knex.TableBuilder) => {  // Type the table parameter
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.integer('user_id').unsigned().notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Remove the foreign key constraint for now
    // table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = async function (knex: Knex) {  // Explicitly type the knex parameter
  await knex.schema.dropTableIfExists('boards');
};
