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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _ChatsHistory_chats, _ChatsHistory_inProgressChats, _ChatsHistory_inProgressChatMessages;
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path = './assets/chats-history.json';
class ChatsHistory {
    constructor() {
        _ChatsHistory_chats.set(this, new Map());
        _ChatsHistory_inProgressChats.set(this, new Map());
        _ChatsHistory_inProgressChatMessages.set(this, new Map());
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield promises_1.default.readFile(path, { encoding: 'utf8' });
            if (!data)
                return;
            const parsed = JSON.parse(data);
            __classPrivateFieldSet(this, _ChatsHistory_chats, new Map(Object.entries(parsed)), "f");
        });
    }
    write(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _ChatsHistory_chats, "f").set(chat.id.toString(), chat);
            const json = JSON.stringify(Object.fromEntries(__classPrivateFieldGet(this, _ChatsHistory_chats, "f")));
            yield promises_1.default.writeFile(path, json);
        });
    }
    get(id) {
        return __classPrivateFieldGet(this, _ChatsHistory_chats, "f").get(id.toString());
    }
    setInProgress(chatId, inProgress) {
        __classPrivateFieldGet(this, _ChatsHistory_inProgressChats, "f").set(chatId.toString(), inProgress);
    }
    isInProgress(chatId) {
        return __classPrivateFieldGet(this, _ChatsHistory_inProgressChats, "f").get(chatId.toString());
    }
    addInProgressMessage(chatId, messageId) {
        const messages = __classPrivateFieldGet(this, _ChatsHistory_inProgressChatMessages, "f").get(chatId.toString());
        if (!messages) {
            __classPrivateFieldGet(this, _ChatsHistory_inProgressChatMessages, "f").set(chatId.toString(), new Set([messageId]));
        }
        else {
            messages.add(messageId);
            __classPrivateFieldGet(this, _ChatsHistory_inProgressChatMessages, "f").set(chatId.toString(), messages);
        }
    }
    deleteInProgressMessages(chatId) {
        __classPrivateFieldGet(this, _ChatsHistory_inProgressChatMessages, "f").delete(chatId.toString());
    }
    getInProgressMessages(chatId) {
        return __classPrivateFieldGet(this, _ChatsHistory_inProgressChatMessages, "f").get(chatId.toString());
    }
}
_ChatsHistory_chats = new WeakMap(), _ChatsHistory_inProgressChats = new WeakMap(), _ChatsHistory_inProgressChatMessages = new WeakMap();
exports.default = ChatsHistory;
//# sourceMappingURL=chats-history.js.map