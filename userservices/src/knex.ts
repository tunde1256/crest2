import Knex from 'knex';

const knex = Knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'Tunde@2024',
    database: 'tunde',
  },
});

export default knex;
