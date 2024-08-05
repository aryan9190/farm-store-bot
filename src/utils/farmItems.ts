import { promises as fs } from 'fs';
import { Item } from '../models/item';

export const getFarmItems = async (): Promise<{ [key: string]: Item }> => {
  const data = await fs.readFile('data/items.json', 'utf8');
  return JSON.parse(data);
};
