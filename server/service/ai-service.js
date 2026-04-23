import messageService from "./message-service.js";
import chatService from "./chat-service.js";
import { sendMessage, sendStream, generateChatTitle } from "../gemini.js";

class AiService {
  async send(chatId, userMessage) {
    await messageService.saveMessage(chatId, userMessage, "user");

    const history = await chatService.getLimitedHistory(chatId, 20);

    const aiReply = await sendMessage(history, userMessage);

    await messageService.saveMessage(chatId, aiReply, "assistant");

    return aiReply;
  }

  async sendStream(chatId, userMessage, onChunk) {
    await messageService.saveMessage(chatId, userMessage, "user");
    console.log("AiService.sendStream userMessage:", userMessage);
    const history = await chatService.getLimitedHistory(chatId, 20);

    let fullReply = "";

    await sendStream(history, userMessage, (chunk) => {
      fullReply += chunk;
      onChunk(chunk);
    });

    await messageService.saveMessage(chatId, fullReply, "assistant");

    return fullReply;
  }

  // async generateChatTitle(chatId, message) {
  //   const title = await generateChatTitle(message);

  //   return chatService.editChatTitle(chatId, title);
  // }
}

export default new AiService();
