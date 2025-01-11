"use strict";
// src/knexfile.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knex = (0, knex_1.default)({
    client: 'mysql', // Change to 'mysql2' if using MySQL
    connection: {
        host: 'localhost', // Your DB host
        user: 'root', // Your DB user
        password: 'Tunde@2024', // Your DB password
        database: 'tunde', // Your DB name
    },
});
exports.default = knex;
