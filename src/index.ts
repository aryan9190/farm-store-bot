import { App } from '@slack/bolt';
import { sendItemList } from './sendUpdate';
import './scheduler'; // Importing scheduler to ensure it runs

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

app.event('app_mention', async ({ event, say }) => {
  await sendItemList();
});

app.action(/buy_.*/, async ({ action, ack, say }) => {
  await ack();
  const itemTag = action.action_id.replace('buy_', '');
  await say(`You bought a ${itemTag.replace('-', '')}`);
});

app.action(/sell_.*/, async ({ action, ack, say }) => {
  await ack();
  const itemTag = action.action_id.replace('sell_', '');
  await say(`You sold a ${itemTag.replace('-', '')}`);
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Farm Store Bot is running!');
})();
