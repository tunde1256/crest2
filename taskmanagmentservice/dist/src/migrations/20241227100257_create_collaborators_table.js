"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = function (knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.createTable('collaborators', (table) => {
            table.increments('id').primary(); // Auto-incrementing ID
            table.integer('board_id').unsigned().notNullable(); // Foreign key for board
            table.integer('user_id').unsigned().notNullable(); // Foreign key for user
            table.string('role').defaultTo('member'); // Optional field for role of the collaborator
            table.timestamp('created_at').defaultTo(knex.fn.now()); // Timestamp for when the collaboration was created
            table.timestamp('updated_at').defaultTo(knex.fn.now()); // Timestamp for when the collaboration was last updated
        });
    });
};
exports.down = function (knex) {
    return __awaiter(this, void 0, void 0, function* () {
        yield knex.schema.dropTableIfExists('collaborators');
    });
};
