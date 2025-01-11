import { Knex } from 'knex';

exports.up = async function (knex: Knex): Promise<void> {
    await knex.schema.createTable('collaborators', (table) => {
      table.increments('id').primary(); // Auto-incrementing ID
      table.integer('board_id').unsigned().notNullable(); // Foreign key for board
      table.integer('user_id').unsigned().notNullable();  // Foreign key for user
      table.string('role').defaultTo('member');  // Optional field for role of the collaborator
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for when the collaboration was created
      table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for when the collaboration was last updated
    });
};

exports.down = async function (knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('collaborators');
};
