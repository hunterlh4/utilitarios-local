import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemPurchaseDto, UpdateSteamItemPurchaseDto } from '../models/steam-item-purchase-request.dto';
import type { SteamItemPurchase } from '../models/steam-item-purchase.model';

const BASE_URL = '/steam-purchase';

export const steamItemPurchaseService = {
  getAll: async (): Promise<SteamItemPurchase[]> => {
    return await apiClient.get(BASE_URL);
  },

  create: async (data: CreateSteamItemPurchaseDto): Promise<number> => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateSteamItemPurchaseDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
