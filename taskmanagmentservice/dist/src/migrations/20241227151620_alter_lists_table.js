"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = function (knex) {
    return knex.schema.table('lists', (table) => {
        // Drop the existing primary key constraint
        table.dropPrimary();
        // Modify the `id` column to auto-increment
        table.increments('id').primary().alter();
    });
};
exports.down = function (knex) {
    return knex.schema.table('lists', (table) => {
        // Revert the `id` column back to a string without auto-increment
        table.string('id').primary().alter();
    });
};
