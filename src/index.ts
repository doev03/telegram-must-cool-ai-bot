import TelegramBotApi from 'node-telegram-bot-api';

import ChatsHistory from './services/chats-history.js';
import BotUtils from './utils/bot-functions.js';
import FusionBot from './services/fusion-bot.js';
import { StoreSession } from 'telegram/sessions';
import GramBot from './services/gram-bot.js';

const DEBUG = false;

const debugToken = '6367312297:AAGhlx0FndqRtUW5KnVBbsUDhJLTzWAZjsg';
const prodToken = '6320698083:AAGBinqmaQMcuNKFsKXOySR6hXmf5VCCyQw';
const token = DEBUG ? debugToken : prodToken;

const apiId = 28603421;
const apiHash = '10f3cb67a642a5865afef427e70cf5f4';
const storeSession = new StoreSession('my_session');
const gramBot = new GramBot(apiId, apiHash, storeSession);

const bot = new TelegramBotApi(token, { polling: true });
const chatsHistory = new ChatsHistory();
const fusionBot = new FusionBot(bot, chatsHistory);

const main = async () => {
  await chatsHistory.init();
  await gramBot.init(token);
  bot.on('message', onMessage);
}

const onMessage = async (msg: TelegramBotApi.Message) => {
  const chat = msg.chat;
  try {
    if (chatsHistory.isInProgress(chat.id)) {
      chatsHistory.addInProgressMessage(chat.id, msg.message_id);
      await BotUtils.sendInProgressMessage(
        bot,
        chatsHistory,
        msg.chat.id,
        'Пожалуйста подождите ответа на предыдущее сообщение',
      );
      return;
    }
    await chatsHistory.write(chat);

    chatsHistory.setInProgress(chat.id, true);

    await commandHandler(msg);

    await BotUtils.deleteInProgressMessages(gramBot, chatsHistory, chat.id);
    chatsHistory.setInProgress(chat.id, false);
  } catch (e) {
    await bot.sendMessage(chat.id, 'Что-то пошло не так.');
    throw e;
  }
}

const onStart = async (msg: TelegramBotApi.Message) => {
  await bot.sendMessage(msg.chat.id, 'Введите описание картинки, которую хотите сгенерировать');
}

const commandHandler = (msg: TelegramBotApi.Message) => {
  switch (msg.text) {
    case '/start':
      return onStart(msg);
    default:
      return fusionBot.generateAndSendImage(msg);
  }
}

main();
