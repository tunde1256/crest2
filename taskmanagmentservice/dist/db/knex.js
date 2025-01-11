"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const knex_1 = __importDefault(require("knex"));
// Load environment variables
dotenv_1.default.config();
// Knex configuration for MySQL
const dbConfig = {
    client: 'mysql2', // Change client to 'mysql2' for MySQL
    connection: {
        host: process.env.DB_HOST || 'localhost', // Provide default values if undefined
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Default MySQL port
        user: process.env.DB_USER || 'root', // MySQL user
        password: process.env.DB_PASSWORD || '', // MySQL password
        database: process.env.DB_NAME || 'crest', // MySQL database name
    },
};
// Initialize knex with the configuration
const db = (0, knex_1.default)(dbConfig);
// Verify connection
db.raw('SELECT 1+1 AS result')
    .then(() => {
    console.log('Connected to the MySQL database!');
})
    .catch((err) => {
    console.error('Failed to connect to the MySQL database:', err);
});
exports.default = db;
