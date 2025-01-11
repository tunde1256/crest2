"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knexConfig = {
    client: 'mysql2', // Example for PostgreSQL, adjust based on your DB
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Tunde@2024',
        database: 'crest',
    },
    migrations: {
        directory: './src/migrations', // Path to your migrations folder
    },
    seeds: {
        directory: './src/seeds', // Path to your seeds folder (if applicable)
    },
};
exports.default = knexConfig;
