import aiService from "../service/ai-service.js";
import chatService from "../service/chat-service.js";

class ChatController {
  async send(req, res, next) {
    try {
      const { chatId, message } = req.body;
      const result = await aiService.send(chatId, message);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async sendStream(req, res, next) {
    try {
      const { chatId, message } = req.body;
      req.socket.setNoDelay(true);
      console.log("ChatController.sendStream req.body:", req.body);
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Content-Encoding", "none");
      res.setHeader("Connection", "keep-alive");

      res.flushHeaders?.();

      let fullReply = "";

      await aiService.sendStream(chatId, message, (chunk) => {
        fullReply += chunk;
        const escaped = chunk.replace(/\n/g, "\\n");
        res.write(`data: ${escaped}\n\n`);
        res.flush?.();
      });

      res.write(`data: [DONE]\n\n`);

      res.end();
    } catch (error) {
      if (error.status === 429) {
        return "Rate limit exceeded. Try again later.";
      }
      if (!res.headersSent) {
        res.end("Error occurred");
      }
      next(error);
    }
  }

  async getAllHistory(req, res, next) {
    try {
      const { chatId } = req.params;
      const result = await chatService.getAllHistory(chatId);
      console.log("getAllHistory result:", result);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async createChat(req, res, next) {
    try {
      const userId = req.user.id;
      const { title, message } = req.body;
      const result = await chatService.createChat(userId, title, message);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  // async editChat(req, res, next) {
  //   try {
  //     const { chatId } = req.params;
  //     const { message } = req.body;
  //     const result = await aiService.generateChatTitle(chatId, message);
  //     return res.json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getAllChats(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await chatService.getUserChats(userId);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();
