const adminIds = [];

export const handleFarmshopCommand: (prisma: PrismaClient) => Middleware<SlackCommandMiddlewareArgs> =
  (prisma) => async ({ command, ack, say }) => {
    await ack();
    const farmItems = await getFarmItems();
    const [action, itemName, price] = command.text.split(' ');

    if (action === 'setprice') {
      if (adminIds.includes(command.user_id)) {
        if (farmItems[itemName] && !isNaN(price)) {
          farmItems[itemName].price = parseFloat(price);
          await say(`Price for ${farmItems[itemName].emoji} set to :gp:${price}.`);
        } else {
          await say('Invalid item or price.');
        }
      } else {
        await say('You do not have permission to use this command.');
      }
    } else if (action === 'buy') {
      await showBuyModal(command.trigger_id, say);
    } else {
      await say('Invalid command. Use `/farmshop buy` or `/farmshop setprice <item> <price>`.');
    }
  };
