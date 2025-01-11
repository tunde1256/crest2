"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
// Removed the custom KnexTable interface
async function up(knex) {
    await knex.schema.table('direct_messages', (table) => {
        table.integer('recipient_id').unsigned().notNullable(); // Adds the recipient_id column
    });
}
async function down(knex) {
    await knex.schema.table('direct_messages', (table) => {
        table.dropColumn('recipient_id'); // Removes the recipient_id column
    });
}
