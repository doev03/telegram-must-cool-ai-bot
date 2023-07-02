import fs from 'fs/promises';
import TelegramBotApi from 'node-telegram-bot-api';

const path = './assets/chats-history.json';

class ChatsHistory {
  #chats = new Map<string, TelegramBotApi.Chat>();
  #inProgressChats = new Map<string, boolean>();
  #inProgressChatMessages = new Map<string, Set<number>>();

  async init() {
    const data = await fs.readFile(path, {encoding: 'utf8'});
    if (!data) return;
    const parsed = JSON.parse(data);
    this.#chats = new Map(Object.entries(parsed));
  }

  async write(chat: TelegramBotApi.Chat) {
    this.#chats.set(chat.id.toString(), chat);
    const json = JSON.stringify(Object.fromEntries(this.#chats));
    await fs.writeFile(path, json);
  }

  get(id: number) {
   return this.#chats.get(id.toString()); 
  }

  setInProgress(chatId: number, inProgress: boolean) {
    this.#inProgressChats.set(chatId.toString(), inProgress);
  }

  isInProgress(chatId: number) {
    return this.#inProgressChats.get(chatId.toString());
  }

  addInProgressMessage(chatId: number, messageId: number) {
    const messages = this.#inProgressChatMessages.get(chatId.toString());
    if (!messages) {
      this.#inProgressChatMessages.set(chatId.toString(), new Set([messageId]));
    } else {
      messages.add(messageId);
      this.#inProgressChatMessages.set(chatId.toString(), messages);
    }
  }

  deleteInProgressMessages(chatId: number) {
    this.#inProgressChatMessages.delete(chatId.toString());
  }

  getInProgressMessages(chatId: number) {
    return this.#inProgressChatMessages.get(chatId.toString());
  }
}

export default ChatsHistory;