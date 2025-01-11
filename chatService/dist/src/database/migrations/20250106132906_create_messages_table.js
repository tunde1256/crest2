"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('messages', (table) => {
        table.increments('id').primary();
        table.integer('chat_room_id').notNullable();
        table.integer('user_id').notNullable();
        table.text('message').notNullable();
        table.timestamp('timestamp').defaultTo(knex.fn.now()).notNullable();
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('messages');
}
