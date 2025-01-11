"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = function (knex) {
    return knex.schema.createTable('messages', (table) => {
        table.increments('id').primary();
        table.integer('chat_room_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.text('message').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
exports.up = function (knex) {
    return knex.schema.createTable('messages', (table) => {
        table.increments('id').primary();
        table.integer('chat_room_id').unsigned().notNullable();
        table.integer('user_id').unsigned().notNullable();
        table.text('message').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};
exports.down = function (knex) {
    return knex.schema.dropTable('messages');
};
