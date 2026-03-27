import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemDropDto, UpdateSteamItemDropDto } from '../models/steam-item-drop-request.dto';
import type { SteamItemDrop } from '../models/steam-item-drop.model';

const BASE_URL = '/steam-drop';

export const steamItemDropService = {
  getAll: async (): Promise<SteamItemDrop[]> => {
    const response = await apiClient.get<SteamItemDrop[]>(BASE_URL);
    return response as unknown as SteamItemDrop[];
  },

  create: async (data: CreateSteamItemDropDto): Promise<number> => {
    const response = await apiClient.post<number>(BASE_URL, data);
    return response as unknown as number;
  },

  update: async (id: number, data: UpdateSteamItemDropDto): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
