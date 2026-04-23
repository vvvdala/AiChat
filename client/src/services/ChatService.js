import $api from "../http";
import { API_URL } from "../http";

export default class ChatService {
  static async send(chatId, message) {
    return $api.post("/message", { chatId, message });
  }

  static async getAllChats() {
    return $api.get("/chats");
  }

  static async getAllHistory(chatId) {
    return $api.get(`/chats/${chatId}`);
  }

  static async createChat(title, message) {
    return $api.post(`/chats`, { title, message });
  }

  static async sendStream(chatId, message, onChunk) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, message }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (const part of parts) {
        if (part.startsWith("data: ")) {
          const text = part.slice(6);
          console.log("TEXT:", JSON.stringify(text));
          if (text !== "[DONE]") {
            onChunk(text.replace(/\\n/g, "\n"));
          }
        }
      }
    }
  }
}
