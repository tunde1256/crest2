"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = function (knex) {
    return knex.schema.createTable('lists', (table) => {
        table.string('id').primary(); // Or use UUID if required
        table.string('name').notNullable();
        table.string('description').notNullable();
        table.string('board_id').notNullable(); // Ensure this matches the foreign key relationship
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.string('user_id'); // Optional, you can make this nullable if not required
    });
};
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('lists');
};
