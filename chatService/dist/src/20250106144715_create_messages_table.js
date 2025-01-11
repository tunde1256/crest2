"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    // Your migration logic to create the table
    await knex.schema.createTable('messages', (table) => {
        table.increments('id').primary();
        table.string('content');
        table.integer('sender_id');
        table.integer('receiver_id');
        table.timestamp('sent_at').defaultTo(knex.fn.now());
    });
}
async function down(knex) {
    // Logic to undo the migration (e.g., drop the table)
    await knex.schema.dropTableIfExists('messages');
}
