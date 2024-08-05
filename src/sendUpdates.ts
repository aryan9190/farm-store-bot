import { WebClient } from '@slack/web-api';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.SLACK_BOT_TOKEN;
const channel = process.env.SLACK_CHANNEL;
const client = new WebClient(token);

const sendUpdate = async () => {
  try {
    const data = await fs.readFile('data/items.json', 'utf8');
    const items = JSON.parse(data);

    let message = '*Farm Store Update:*\n';
    for (const [name, item] of Object.entries(items)) {
      message += `${item.emoji} *${name}* - :gp:${item.price}\n`;
    }

    await client.chat.postMessage({
      channel: channel,
      text: message,
    });

    console.log('Update sent to Slack channel');
  } catch (error) {
    console.error('Error sending update:', error);
  }
};

sendUpdate();
