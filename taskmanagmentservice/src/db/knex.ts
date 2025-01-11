import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const dbConfig = {
  client: 'mysql2',  
  connection: {
    host: process.env.DB_HOST || 'localhost',  
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,  
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD || '',  
    database: process.env.DB_NAME || 'crest',  
  },
};

const db = knex(dbConfig);

db.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Connected to the MySQL database!');
  })
  .catch((err) => {
    console.error('Failed to connect to the MySQL database:', err);
  });

export default db;
