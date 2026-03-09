import { apiClient } from '@/config/api/api-client';
import type { CreateSteamItemDto, UpdateSteamItemDto } from '../models/steam-item-request.dto';
import type { GetAllSteamItemsResponse, GetSteamItemByIdResponse } from '../models/steam-item-response.dto';

const BASE_URL = '/steam-item';

export const steamItemService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllSteamItemsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetSteamItemByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSteamItemDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSteamItemDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
