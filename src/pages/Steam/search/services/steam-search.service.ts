import { apiClient } from '@/config/api/api-client';
import type { SteamSearchResponse } from '../models/steam-search.model';

const USD_TO_PEN = 3.75;

export interface BulkSteamItemDto {
  externalId?: string;
  name: string;
  image: string;
  price?: number;
  game: 1 | 2;
  marketUrl: string;
}

export interface BulkCreateResult {
  created: number;
  skipped: number;
}

export const steamSearchService = {
  search: async (query: string, game: 1 | 2 = 1): Promise<SteamSearchResponse> => {
    return await apiClient.get('/steam/item-api-search', { params: { query, game } });
  },

  bulkCreate: async (items: BulkSteamItemDto[]): Promise<BulkCreateResult> => {
    const converted = items.map((item) => ({
      ...item,
      price: item.price != null ? parseFloat((item.price * USD_TO_PEN).toFixed(2)) : 0,
    }));
    return await apiClient.post('/steam/item-bulk', converted);
  },

  convertToSoles: (priceInCents: number): string => {
    const usd = priceInCents / 100;
    const pen = usd * USD_TO_PEN;
    return `S/. ${pen.toFixed(2)}`;
  },

  getImageUrl: (iconUrl: string): string =>
    `https://community.cloudflare.steamstatic.com/economy/image/${iconUrl}/96fx96f`,
};
