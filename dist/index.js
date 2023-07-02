"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const image_generator_js_1 = __importDefault(require("./fusion/image-generator.js"));
const chats_history_js_1 = __importDefault(require("./services/chats-history.js"));
const token = '6320698083:AAGBinqmaQMcuNKFsKXOySR6hXmf5VCCyQw';
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
const fusionImageGenerator = new image_generator_js_1.default();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield chatsHistory.init();
    bot.on('message', onMessage);
});
const chatsHistory = new chats_history_js_1.default();
const onMessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chat = msg.chat;
    try {
        if (chatsHistory.isInProgress(chat.id)) {
            yield bot.deleteMessage(chat.id, msg.message_id);
            yield sendInProgressMessage(msg.chat.id, 'Пожалуйста подождите ответа на предыдущее сообщение');
            return;
        }
        yield chatsHistory.write(chat);
        chatsHistory.setInProgress(chat.id, true);
        yield commandHandler(msg);
        yield deleteInProgressMessages(chat.id);
        chatsHistory.setInProgress(chat.id, false);
    }
    catch (e) {
        yield bot.sendMessage(chat.id, 'Что-то пошло не так.');
        throw e;
    }
});
const sendInProgressMessage = (chatId, message) => __awaiter(void 0, void 0, void 0, function* () {
    const sendedMessage = yield bot.sendMessage(chatId, message);
    chatsHistory.addInProgressMessage(chatId, sendedMessage.message_id);
});
const deleteInProgressMessages = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const inProgressMessages = chatsHistory.getInProgressMessages(chatId);
    if (!inProgressMessages)
        return;
    chatsHistory.deleteInProgressMessages(chatId);
    for (const messageId of inProgressMessages) {
        yield bot.deleteMessage(chatId, messageId);
    }
});
const generateAndSendImage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield sendInProgressMessage(msg.chat.id, 'Ожидайте, картина генерится...');
    const image = msg.text == null ? null : yield fusionImageGenerator.generateImage(msg.text, '');
    if (image != null) {
        const buffer = Buffer.from(image, 'base64');
        yield bot.sendPhoto(msg.chat.id, buffer);
    }
});
const onStart = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    yield bot.sendMessage(msg.chat.id, 'Введите описание картинки, которую хотите сгенерировать');
});
const commandHandler = (msg) => {
    switch (msg.text) {
        case '/start':
            return onStart(msg);
        default:
            return generateAndSendImage(msg);
    }
};
main();
//# sourceMappingURL=index.js.map