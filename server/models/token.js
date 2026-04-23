import { Model } from "objection";
import User from "./user.js";

class Token extends Model {
  static get tableName() {
    return "Tokens";
  }

  static get idColumn() {
    return "Id";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Tokens.UserId",
          to: "Users.Id",
        },
      },
    };
  }
}

export default Token;
