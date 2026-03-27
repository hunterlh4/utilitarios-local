import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemDto, UpdateSteamItemDto } from '../models/steam-item-request.dto';
import type { SteamItem } from '../models/steam-item.model';

const BASE_URL = '/steam-item';

export const steamItemService = {
  getAll: async (): Promise<SteamItem[]> => {
    const response = await apiClient.get<SteamItem[]>(BASE_URL);
    return response as unknown as SteamItem[];
  },

  getById: async (id: number): Promise<SteamItem> => {
    const response = await apiClient.get<SteamItem>(`${BASE_URL}/${id}`);
    return response as unknown as SteamItem;
  },

  create: async (data: CreateSteamItemDto): Promise<number> => {
    const response = await apiClient.post<number>(BASE_URL, {
      ...data,
      game: Number(data.game),
      status: Number(data.status),
    });
    return response as unknown as number;
  },

  update: async (id: number, data: UpdateSteamItemDto): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, {
      ...data,
      game: data.game != null ? Number(data.game) : undefined,
      status: data.status != null ? Number(data.status) : undefined,
    });
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
