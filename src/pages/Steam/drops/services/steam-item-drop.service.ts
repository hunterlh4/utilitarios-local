import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemDropDto, UpdateSteamItemDropDto } from '../models/steam-item-drop-request.dto';
import type { SteamItemDrop } from '../models/steam-item-drop.model';

const BASE_URL = '/steam-drop';

export const steamItemDropService = {
  getAll: async (): Promise<SteamItemDrop[]> => {
    return await apiClient.get(BASE_URL);
  },

  create: async (data: CreateSteamItemDropDto): Promise<number> => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateSteamItemDropDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
