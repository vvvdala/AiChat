import { messageRepository } from "../db/repository.js";

class MessageService {
  async saveMessage(chatId, content, role) {
    const normalized =
      typeof content === "object" ? JSON.stringify(content) : String(content);
    console.log("MessageService.saveMessage content:", content);
    return await messageRepository.saveMessage({
      ChatId: chatId,
      Content: normalized,
      Role: role,
    });
  }
}

export default new MessageService();
