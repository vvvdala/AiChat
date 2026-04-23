/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("Tokens", (table) => {
    table.increments("Id").primary();
    table
      .integer("UserId")
      .unsigned()
      .references("Id")
      .inTable("Users")
      .onDelete("CASCADE");
    table.string("RefreshToken").notNullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("Tokens");
}
