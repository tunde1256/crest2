import { Knex } from "knex";

// Removed the custom KnexTable interface

export async function up(knex: Knex): Promise<void> {
    await knex.schema.table('direct_messages', (table: Knex.AlterTableBuilder) => {
        table.integer('recipient_id').unsigned().notNullable(); // Adds the recipient_id column
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('direct_messages', (table: Knex.AlterTableBuilder) => {
        table.dropColumn('recipient_id'); // Removes the recipient_id column
    });
}
