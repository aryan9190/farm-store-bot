import { WebClient } from '@slack/web-api';
import { farmItems } from './items';

const client = new WebClient(process.env.SLACK_BOT_TOKEN);
const channelId = 'farm-store';

export const sendItemList = async () => {
  const blocks = farmItems.map((item) => ({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*${item.name}*\n${item.description}\nPrice: :gp: ${item.genstore_sell_to_player_price}`
    },
    accessory: {
      type: 'image',
      image_url: item.image,
      alt_text: item.name
    },
    actions: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Buy'
        },
        value: `buy-${item.tag}`,
        action_id: `buy_${item.tag}`
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Sell'
        },
        value: `sell-${item.tag}`,
        action_id: `sell_${item.tag}`
      }
    ]
  }));

  await client.chat.postMessage({
    channel: channelId,
    text: 'Farm Store Items:',
    blocks
  });
};
