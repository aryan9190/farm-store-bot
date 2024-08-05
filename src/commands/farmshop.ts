import { PrismaClient } from '@prisma/client';
import { Middleware, SlackCommandMiddlewareArgs } from '@slack/bolt';
import { showBuyModal } from '../farmstoreBuy';
import { getFarmItems } from '../utils/farmItems';

export const handleFarmshopCommand: (prisma: PrismaClient) => Middleware<SlackCommandMiddlewareArgs> =
  (prisma) => async ({ command, ack, say }) => {
    await ack();
    const farmItems = await getFarmItems();
    const [action, itemName, price] = command.text.split(' ');

    if (action === 'buy') {
      await showBuyModal(command.trigger_id, say);
    } else if (action === 'setprice' && farmItems[itemName] && !isNaN(price)) {
      farmItems[itemName].price = parseFloat(price);
      await say(`Price for ${farmItems[itemName].emoji} set to :gp:${price}.`);
    } else {
      await say('Invalid command. Use `/farmshop buy` or `/farmshop setprice <item> <price>`.');
    }
  };
