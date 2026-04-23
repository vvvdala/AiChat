/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("Messages", (table) => {
    table.increments("Id").primary();
    table
      .integer("ChatId")
      .unsigned()
      .references("Id")
      .inTable("Chats")
      .onDelete("CASCADE");
    table
      .enu("Role", ["user", "assistant"], {
        useNative: true,
        enumName: "message_role",
      })
      .notNullable();
    table.text("Content").notNullable();
    table.timestamp("Created_At").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("Messages");
}
