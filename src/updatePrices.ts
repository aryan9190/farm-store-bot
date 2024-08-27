import { farmItems } from './items';

export const updatePrices = () => {
  farmItems.forEach(item => {
    const variance = item.genstore_price_variance || 0.05; // Default 5% variance
    const priceFluctuation = item.genstore_sell_to_player_price * variance;
    const newPrice = item.genstore_sell_to_player_price + (Math.random() > 0.5 ? priceFluctuation : -priceFluctuation);

    item.genstore_sell_to_player_price = parseFloat(newPrice.toFixed(2));
    item.genstore_buy_from_player_price = parseFloat((newPrice * 0.5).toFixed(2)); // Example: Buy price is half of sell price
  });

  console.log('Prices have been updated.');
};
