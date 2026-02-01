import { apiClient } from '@/config/api/api-client';
import { CreateSteamItemDropDto, UpdateSteamItemDropDto } from '../models/steam-item-drop-request.dto';
import { GetAllSteamItemDropsResponse, GetSteamItemDropByIdResponse } from '../models/steam-item-drop-response.dto';

const BASE_URL = '/steam-item-drop';

export const steamItemDropService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllSteamItemDropsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetSteamItemDropByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSteamItemDropDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSteamItemDropDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
