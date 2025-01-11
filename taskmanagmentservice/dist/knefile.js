"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: 'pg', // Use 'mysql2' for MySQL, 'sqlite3' for SQLite
        connection: {
            host: '127.0.0.1',
            port: 5432, // Change this for your database type
            user: 'your_db_user',
            password: 'your_db_password',
            database: 'your_database_name',
        },
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
    production: {
        client: 'pg', // Update for your production database
        connection: process.env.DATABASE_URL,
        migrations: {
            directory: './migrations',
        },
        seeds: {
            directory: './seeds',
        },
    },
};
exports.default = config;
