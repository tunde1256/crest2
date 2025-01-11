import { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knexConfig: Knex.Config = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Tunde@2024',
    database: process.env.DB_NAME || 'tunde',
    port: Number(process.env.DB_PORT) || 3306,
  },
  migrations: {
    directory: './src/migrations',
    tableName: 'knex_migrations',
  },
  seeds: {
    directory: './src/seeds',
  },
};

export default knexConfig;
