import { App } from '@slack/bolt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

import { handleFarmshopCommand } from './commands/farmshop';
import { showBuyModal, handleBuyModalSubmit } from './genstoreBuy';

app.command('/farmshop', handleFarmshopCommand(prisma));
app.view('buy_modal', handleBuyModalSubmit(prisma));

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Farm Shop Bot is running!');
})();
