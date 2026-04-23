import knex from "knex";
import knexConfig from "./knexfile.js";
import { Model } from "objection";

export function setupDb() {
  const db = knex(knexConfig.development);
  Model.knex(db);
}
