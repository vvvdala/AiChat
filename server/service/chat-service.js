import { chatRepository } from "../db/repository.js";
import { generateChatTitle } from "../gemini.js";

class ChatService {
  async getLimitedHistory(chatId, count = 20) {
    return chatRepository.getLimitedHistory(chatId, count);
  }

  async getAllHistory(chatId) {
    return chatRepository.getAllHistory(chatId);
  }

  async getUserChats(userId) {
    return chatRepository.getUserChats(userId);
  }

  async createChat(userId, title, message) {
    if (title === "New Chat") {
      title = await generateChatTitle(message);
    }
    return await chatRepository.createChat({ UserId: userId, Title: title });
  }

  // async editChatTitle(chatId, title) {
  //   return await chatRepository.editChat(chatId, title);
  // }
}

export default new ChatService();
