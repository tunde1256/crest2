"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const knex_1 = __importDefault(require("knex"));
dotenv_1.default.config();
const dbConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Tunde@2024',
        database: process.env.DB_NAME || 'chatdb',
    },
    migrations: {
        directory: './src/database/migrations', // Adjust path to where your migrations are located
    },
};
exports.db = (0, knex_1.default)(dbConfig);
// Test the database connection on application startup
exports.db.raw('SELECT 1+1 AS result')
    .then(() => {
    console.log('Connected to the database successfully!');
})
    .catch((error) => {
    console.error('Database connection failed:', error.message);
});
