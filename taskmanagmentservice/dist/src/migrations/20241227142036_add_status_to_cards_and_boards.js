"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = function (knex) {
    return knex.schema
        .table('cards', function (table) {
        // Add 'status' column to the 'cards' table
        table.enu('status', ['To Do', 'In Progress', 'Completed']).defaultTo('To Do');
    })
        .table('boards', function (table) {
        // Add 'status' column to the 'boards' table
        table.enu('status', ['Active', 'Archived']).defaultTo('Active');
    });
};
exports.down = function (knex) {
    return knex.schema
        .table('cards', function (table) {
        // Remove 'status' column from the 'cards' table
        table.dropColumn('status');
    })
        .table('boards', function (table) {
        // Remove 'status' column from the 'boards' table
        table.dropColumn('status');
    });
};
