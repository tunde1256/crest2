import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Create direct_messages table
  await knex.schema.createTable('direct_messages', (table) => {
    table.increments('id').primary(); // Auto-increment primary key
    table.integer('sender_id').unsigned().notNullable(); // Sender ID
    table.integer('receiver_id').unsigned().notNullable(); // Receiver ID
    table.text('message').notNullable(); // Message content
    table.timestamp('sent_at').defaultTo(knex.fn.now()).notNullable(); // Timestamp of the message
    table.boolean('is_read').defaultTo(false); // Boolean indicating if the message is read
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop the direct_messages table if it exists
  await knex.schema.dropTableIfExists('direct_messages');
}
