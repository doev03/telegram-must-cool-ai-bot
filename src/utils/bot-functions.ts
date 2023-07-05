import TelegramBot from "node-telegram-bot-api";
import ChatsHistory from '../services/chats-history.js';
import GramBot from "../services/gram-bot.js";

class BotUtils {
  static async sendInProgressMessage(
    bot: TelegramBot,
    chatsHistory: ChatsHistory,
    chatId: number,
    message: string,
  ) {
    const sendedMessage = await bot.sendMessage(chatId, message);
    chatsHistory.addInProgressMessage(chatId, sendedMessage.message_id);
  }

  static async deleteInProgressMessages(
    gramBot: GramBot,
    chatsHistory: ChatsHistory,
    chatId: number,
  ) {
    const inProgressMessages = chatsHistory.getInProgressMessages(chatId);
    if (!inProgressMessages) return;

    chatsHistory.deleteInProgressMessages(chatId);
    await gramBot.deleteMessages(chatId, [...inProgressMessages]);
  }
}

export default BotUtils;