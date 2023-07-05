import TelegramBotApi from 'node-telegram-bot-api';
import ChatsHistory from './chats-history';
import BotUtils from '../utils/bot-functions';
import FusionImageGenerator from '../fusion/image-generator';

class FusionBot {
  constructor(
    bot: TelegramBotApi,
    chatsHistory: ChatsHistory,
  ) {
    this.bot = bot;
    this.chatsHistory = chatsHistory;
  }

  bot: TelegramBotApi;
  chatsHistory: ChatsHistory;

  fusionImageGenerator = new FusionImageGenerator();

  generateAndSendImage = async (msg: TelegramBotApi.Message) => {
    await BotUtils.sendInProgressMessage(
      this.bot,
      this.chatsHistory,
      msg.chat.id,
      'Ожидайте, картина генерится...',
    );
    const image = msg.text == null ? null : await this.fusionImageGenerator.generateImage(msg.text, '');

    if (image != null) {
      const buffer = Buffer.from(image, 'base64');
      await this.bot.sendPhoto(msg.chat.id, buffer);
    }
  }
}

export default FusionBot;