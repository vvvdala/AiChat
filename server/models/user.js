import { Model } from "objection";
import Chat from "./chat.js";

class User extends Model {
  static get tableName() {
    return "Users";
  }

  static get idColumn() {
    return "Id";
  }

  static get relationMappings() {
    return {
      chats: {
        relation: Model.HasManyRelation,
        modelClass: Chat,
        join: {
          from: "Users.Id",
          to: "Chats.UserId",
        },
      },
    };
  }
}

export default User;
