require('dotenv').config();
import { App } from '@slack/bolt';
import { PrismaClient } from '@prisma/client';
import { makeOffer } from '@hackclub/bag';

const prisma = new PrismaClient();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

const farmItems = {
  potato: '🥔',
  onion: '🧅',
  carrot: '🥕'
};

app.command('/farmshop', async ({ command, ack, say }) => {
  await ack();
  const [action, itemName, price] = command.text.split(' ');

  if (action === 'offer' && farmItems[itemName]) {
    const sourceIdentityId = command.user_id;
    const targetIdentityId = 'target_user_id'; // Replace with actual target user ID
    const offerToGive = [{ itemName, quantity: 1 }];
    const offerToReceive = [{ itemName: 'currency', quantity: parseFloat(price) }];
    const callbackUrl = 'http://your-callback-url'; // Replace with actual callback URL

    const response = await makeOffer(prisma, sourceIdentityId, targetIdentityId, offerToGive, offerToReceive, callbackUrl);

    if (response.success) {
      await say(`Offer made for ${farmItems[itemName]} at price $${price}.`);
    } else {
      await say(`Failed to make offer: ${response.response}`);
    }
  } else {
    await say('Invalid command. Use `/farmshop offer <item> <price>`.');
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Farm Shop Bot is running!');
})();
