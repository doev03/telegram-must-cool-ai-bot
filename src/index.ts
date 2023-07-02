import TelegramBotApi from 'node-telegram-bot-api';

import FusionImageGenerator from './fusion/image-generator.js';
import ChatsHistory from './services/chats-history.js';

const token = '6320698083:AAGBinqmaQMcuNKFsKXOySR6hXmf5VCCyQw';

const bot = new TelegramBotApi(token, { polling: true });

const fusionImageGenerator = new FusionImageGenerator();

const main = async () => {
  await chatsHistory.init();
  bot.on('message', onMessage);
}

const chatsHistory = new ChatsHistory();

const onMessage = async (msg: TelegramBotApi.Message) => {
  const chat = msg.chat;
  try {
    if (chatsHistory.isInProgress(chat.id)) {
      await bot.deleteMessage(chat.id, msg.message_id);
      await sendInProgressMessage(msg.chat.id,'Пожалуйста подождите ответа на предыдущее сообщение');
      return;
    }
    await chatsHistory.write(chat);

    chatsHistory.setInProgress(chat.id, true);

    await commandHandler(msg);

    await deleteInProgressMessages(chat.id);
    chatsHistory.setInProgress(chat.id, false);
  } catch (e) {
    await bot.sendMessage(chat.id, 'Что-то пошло не так.');
    throw e;
  }
}

const sendInProgressMessage = async (chatId: number, message: string) => {
  const sendedMessage = await bot.sendMessage(chatId, message);
  chatsHistory.addInProgressMessage(chatId, sendedMessage.message_id);
}

const deleteInProgressMessages = async (chatId: number) => {
  const inProgressMessages = chatsHistory.getInProgressMessages(chatId);
  if (!inProgressMessages) return;

  chatsHistory.deleteInProgressMessages(chatId);
  for (const messageId of inProgressMessages) {
    await bot.deleteMessage(chatId, messageId);
  }
}

const generateAndSendImage = async (msg: TelegramBotApi.Message) => {
  await sendInProgressMessage(msg.chat.id, 'Ожидайте, картина генерится...');
  const image = msg.text == null ? null : await fusionImageGenerator.generateImage(msg.text, '');

  if (image != null) {
    const buffer = Buffer.from(image, 'base64');
    await bot.sendPhoto(msg.chat.id, buffer);
  }
}

const onStart = async (msg: TelegramBotApi.Message) => {
  await bot.sendMessage(msg.chat.id, 'Введите описание картинки, которую хотите сгенерировать');
}

const commandHandler = (msg: TelegramBotApi.Message) => {
  switch(msg.text) {
    case '/start':
      return onStart(msg);
    default:
      return generateAndSendImage(msg);
  }
}

main();
