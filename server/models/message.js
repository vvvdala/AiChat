import { Model } from "objection";
import Chat from "./chat.js";

class Message extends Model {
  static get tableName() {
    return "Messages";
  }

  static get idColumn() {
    return "Id";
  }

  static get relationMappings() {
    return {
      chat: {
        relation: Model.BelongsToOneRelation,
        modelClass: Chat,
        join: {
          from: "Messages.ChatId",
          to: "Chats.Id",
        },
      },
    };
  }
}

export default Message;
