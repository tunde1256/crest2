"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (knex) => {
    await knex.schema.table('messages', (table) => {
        // Modify 'message' column to ensure it is of TEXT type if not already
        table.text('message').alter();
        // Ensure 'sent_at' column has the default CURRENT_TIMESTAMP if not already
        table.timestamp('sent_at').defaultTo(knex.fn.now()).alter();
    });
};
exports.up = up;
const down = async (knex) => {
    // Rollback changes if necessary (optional)
    await knex.schema.table('messages', (table) => {
        // You may want to revert or adjust based on your requirements
        table.dropColumn('message');
        table.dropColumn('sent_at');
    });
};
exports.down = down;
