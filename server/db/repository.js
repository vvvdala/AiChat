import Chat from "../models/chat.js";
import Message from "../models/message.js";
import User from "../models/user.js";

export const chatRepository = {
  createChat: async (data) => {
    return Chat.query().insert(data);
  },
  getLimitedHistory: async (chatId, count = 20) => {
    const chat = await Chat.query()
      .findById(chatId)
      .withGraphFetched("messages(orderByCreatedAt)")
      .modifiers({
        orderByCreatedAt(builder) {
          builder.select("Role", "Content");
          builder.orderBy("Created_At", "asc").limit(count);
        },
      });
    return chat?.messages || [];
  },
  getAllHistory: async (chatId) => {
    const chat = await Chat.query()
      .findById(chatId)
      .withGraphFetched("messages(orderByCreatedAt)")
      .modifiers({
        orderByCreatedAt(builder) {
          builder.select("Id", "Role", "Content", "Created_At");
          builder.orderBy("Created_At", "asc");
        },
      });
    return chat?.messages || [];
  },
  getUserChats: async (userId) => {
    const user = await User.query()
      .findById(userId)
      .withGraphFetched("chats(orderByDate)")
      .modifiers({
        orderByDate(builder) {
          builder.orderBy("Updated_At", "desc");
        },
      });
    return user.chats;
  },
  editChat: async (chatId, title) => {
    return Chat.query().patchAndFetchById(chatId, { Title: title });
  },
};

export const messageRepository = {
  saveMessage: async (data) => {
    return Message.query().insert(data);
  },
};

export const userRepository = {
  editProfile: async (emoji, userId) => {
    return User.query().patchAndFetchById(userId, { Avatar: emoji });
  },
};
