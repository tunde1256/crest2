"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knex = (0, knex_1.default)({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Tunde@2024',
        database: 'tunde',
    },
});
exports.default = knex;
