import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';

class GramBot {
  constructor(
    apiId: number,
    apiHash: string,
    storeSession: StoreSession,
  ) {
    this.storeSession = storeSession;
    this.client = new TelegramClient(
      storeSession,
      apiId,
      apiHash,
      { connectionRetries: 5 },
    );
  }

  client: TelegramClient;
  storeSession: StoreSession;

  async init(botToken: string) {
    await this.client.start({
      botAuthToken: botToken,
    });
    console.log(this.storeSession.save());
  }

  deleteMessages(
    chatId: number,
    messageIds: number[],
  ) {
    return this.client.deleteMessages(chatId, messageIds, {revoke: true});
  }
}

export default GramBot;