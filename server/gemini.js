import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateChatTitle(message) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Come up with a short chat name (2-5 words) based on this message:\n\n"${message}"\n\n
    Detect the language of the message and respond in the same language. Return only the title, no quotes, no explanations.`,
  });

  return response.text;
}

export async function sendMessage(history, newMessage) {
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    history: history.map((msg) => ({
      role: msg.Role === "assistant" ? "model" : "user",
      parts: [{ text: msg.Content }],
    })),
  });

  const response = await chat.sendMessage({ message: newMessage });
  return response.text();
}

export async function sendStream(history, newMessage, onChunk) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history.map((msg) => ({
        role: msg.Role === "assistant" ? "model" : "user",
        parts: [{ text: msg.Content }],
      })),
    });

    const result = await chat.sendMessageStream({
      message: newMessage,
    });

    for await (const chunk of result) {
      const text =
        chunk.text || chunk.candidates?.[0]?.content?.parts?.[0]?.text;

      console.log("Chunk received:", text);
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error("Ошибка в sendStream:", error);
  }
}
