// src/migrations/20240101123456_create_users_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // auto-incrementing primary key
    table.string('fullname').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
    table.string('gender').notNullable();
    table.string('phoneNumber').notNullable();
    table.string('profilePicture'); // Optional field for profile picture URL
    table.timestamps(true, true); // automatically adds created_at and updated_at fields
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('users');
}
