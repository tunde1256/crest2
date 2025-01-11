import { Knex } from 'knex';

exports.up = function(knex: Knex): Promise<void> {
  return knex.schema
    .table('cards', function(table: Knex.TableBuilder) {
      // Add 'status' column to the 'cards' table
      table.enu('status', ['To Do', 'In Progress', 'Completed']).defaultTo('To Do');
    })
    .table('boards', function(table: Knex.TableBuilder) {
      // Add 'status' column to the 'boards' table
      table.enu('status', ['Active', 'Archived']).defaultTo('Active');
    });
};

exports.down = function(knex: Knex): Promise<void> {
  return knex.schema
    .table('cards', function(table: Knex.TableBuilder) {
      // Remove 'status' column from the 'cards' table
      table.dropColumn('status');
    })
    .table('boards', function(table: Knex.TableBuilder) {
      // Remove 'status' column from the 'boards' table
      table.dropColumn('status');
    });
};
