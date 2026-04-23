import { makeAutoObservable, runInAction } from "mobx";
import ChatService from "../services/ChatService";

export default class ChatStore {
  userChats = [];
  chatId = null;
  chatHistory = [];
  isHistoryLoading = false;
  isChatsLoading = false;
  streamingMessage = "";
  isStreaming = false;
  isWaitingForFirstChunk = false;

  setStreamingMessage(text) {
    this.streamingMessage = text;
  }

  setWaitingFirstChunk(bool) {
    this.isWaitingForFirstChunk = bool;
  }

  setUserChats(data) {
    this.userChats = data;
  }

  setChatHistory(data) {
    console.log("setChatHistory data:", data);
    this.chatHistory = data;
  }

  setHistoryLoading(bool) {
    this.isHistoryLoading = bool;
  }

  setChatsLoading(bool) {
    this.isChatsLoading = bool;
  }

  setChatId(id) {
    this.chatId = id;
  }

  appendStreamingMessage(chunk) {
    runInAction(() => {
      this.streamingMessage += chunk;
    });
  }

  resetStreaming() {
    this.streamingMessage = "";
  }

  setStreaming(bool) {
    this.isStreaming = bool;
  }

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUserChats() {
    this.setChatsLoading(true);
    try {
      const { data } = await ChatService.getAllChats();
      console.log(data);
      this.setUserChats(data);
    } catch (error) {
      console.log(error);
    } finally {
      this.setChatsLoading(false);
    }
  }

  async fetchChatHistory(chatId) {
    this.setHistoryLoading(true);
    try {
      const { data } = await ChatService.getAllHistory(chatId);
      console.log(data);
      this.setChatHistory(data);
    } catch (error) {
      console.log(error);
    } finally {
      this.setHistoryLoading(false);
    }
  }

  async createChat(title, message) {
    try {
      const { data } = await ChatService.createChat(title, message);
      console.log(data);
      this.setUserChats([...this.userChats, data]);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  updateLastMessage(id, text) {
    const index = this.chatHistory.findIndex((ch) => ch.Id === id);
    if (index !== -1) {
      const msg = this.chatHistory[index];
      this.chatHistory[index] = { ...msg, Content: msg.Content + text };
    }
  }
}
