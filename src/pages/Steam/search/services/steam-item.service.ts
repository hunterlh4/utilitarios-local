import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemDto, UpdateSteamItemDto } from '../models/steam-item-request.dto';
import type { SteamItem } from '../models/steam-item.model';

const BASE_URL = '/steam/item';

export const steamItemService = {
  getAll: async (): Promise<SteamItem[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<SteamItem> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateSteamItemDto): Promise<number> => {
    return await apiClient.post(BASE_URL, {
      ...data,
      game: Number(data.game),
      status: Number(data.status),
    });
  },

  update: async (id: number, data: UpdateSteamItemDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, {
      ...data,
      game: data.game != null ? Number(data.game) : undefined,
      status: data.status != null ? Number(data.status) : undefined,
    });
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
