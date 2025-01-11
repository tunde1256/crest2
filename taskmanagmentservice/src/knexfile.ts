import { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'mysql2', 
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tunde@2024',
    database: 'crest',
  },
  migrations: {
    directory: './src/migrations', 
  },
  seeds: {
    directory: './src/seeds', 
  },
};

export default knexConfig;
