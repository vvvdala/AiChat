/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable("Users", (table) => {
    table.increments("Id").primary();
    table.string("Name").notNullable();
    table.string("Surname").notNullable();
    table.string("Username").notNullable().unique();
    table.string("Email").notNullable().unique();
    table.string("Password").nullable();
    table.string("Avatar").nullable();
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists("Users");
}
