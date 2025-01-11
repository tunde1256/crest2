import knex, { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'mysql', 
  connection: {
    host: 'localhost', 
    user: 'root', 
    password: 'Tunde@2024', 
    database: 'tunde', 
    port: 3306, 
  },
  pool: { min: 2, max: 10 }, 
};

const db = knex(knexConfig);

(async () => {
  try {
    await db.raw('SELECT 1+1 AS result');
    console.log('Connected to the database successfully!');
  } catch (error) {
    console.error('Failed to connect to the database:');
    process.exit(1); 
  }
})();

export default db;
