/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("Chats", (table) => {
    table.increments("Id").primary();
    table
      .integer("UserId")
      .unsigned()
      .references("Id")
      .inTable("Users")
      .onDelete("CASCADE");
    table.string("Title").defaultTo("New chat");
    table.timestamp("Created_At").defaultTo(knex.fn.now());
    table.timestamp("Updated_At").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("Chats");
}
