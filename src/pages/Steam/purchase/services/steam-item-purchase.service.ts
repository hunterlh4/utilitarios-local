import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemPurchaseDto, UpdateSteamItemPurchaseDto } from '../models/steam-item-purchase-request.dto';
import type { SteamItemPurchase } from '../models/steam-item-purchase.model';

const BASE_URL = '/steam-purchase';

export const steamItemPurchaseService = {
  getAll: async (): Promise<SteamItemPurchase[]> => {
    const response = await apiClient.get<SteamItemPurchase[]>(BASE_URL);
    return response as unknown as SteamItemPurchase[];
  },

  create: async (data: CreateSteamItemPurchaseDto): Promise<number> => {
    const response = await apiClient.post<number>(BASE_URL, data);
    return response as unknown as number;
  },

  update: async (id: number, data: UpdateSteamItemPurchaseDto): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
