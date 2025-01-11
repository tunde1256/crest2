import dotenv from 'dotenv';
import knex, { Knex } from 'knex';

dotenv.config();

const dbConfig: Knex.Config = {
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

export const db = knex(dbConfig);

// Test the database connection on application startup
db.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Connected to the database successfully!');
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message);
  });
