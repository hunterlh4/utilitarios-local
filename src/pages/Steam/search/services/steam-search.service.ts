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
    const response = await apiClient.get<SteamSearchResponse>('/steam-item/steam-api-search', {
      params: { query, game },
    });
    return response as unknown as SteamSearchResponse;
  },

  bulkCreate: async (items: BulkSteamItemDto[]): Promise<BulkCreateResult> => {
    const converted = items.map((item) => ({
      ...item,
      price: item.price != null ? parseFloat((item.price * USD_TO_PEN).toFixed(2)) : 0,
    }));
    const response = await apiClient.post<BulkCreateResult>('/steam-item/bulk', converted);
    return response as unknown as BulkCreateResult;
  },

  convertToSoles: (priceInCents: number): string => {
    const usd = priceInCents / 100;
    const pen = usd * USD_TO_PEN;
    return `S/. ${pen.toFixed(2)}`;
  },

  getImageUrl: (iconUrl: string): string =>
    `https://community.cloudflare.steamstatic.com/economy/image/${iconUrl}/96fx96f`,
};
