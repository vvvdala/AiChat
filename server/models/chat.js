import { Model } from "objection";
import User from "./user.js";
import Message from "./message.js";

class Chat extends Model {
  static get tableName() {
    return "Chats";
  }

  static get idColumn() {
    return "Id";
  }

  async $beforeUpdate() {
    this.Updated_At = new Date();
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Chats.UserId",
          to: "Users.Id",
        },
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: Message,
        join: {
          from: "Chats.Id",
          to: "Messages.ChatId",
        },
      },
    };
  }
}

export default Chat;
