"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const knexConfig = {
    client: 'mysql', // or 'pg' for PostgreSQL
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Tunde@2024',
        database: process.env.DB_NAME || 'tunde',
        port: Number(process.env.DB_PORT) || 3306, // Ensure the correct port
    },
    migrations: {
        directory: './src/migrations', // Path to your migrations folder
        tableName: 'knex_migrations', // Default migration table
    },
    seeds: {
        directory: './src/seeds', // Path to your seeds folder
    },
};
exports.default = knexConfig;
