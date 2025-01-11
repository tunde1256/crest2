"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knexConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Tunde@2024',
        database: process.env.DB_NAME || 'chatdb',
    },
    migrations: {
        directory: './src',
        extension: 'ts', // Ensure this is set to '.ts' for TypeScript migrations
    },
};
exports.default = knexConfig;
