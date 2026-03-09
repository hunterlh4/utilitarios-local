import { apiClient } from '@/config/api/api-client';
import type { CreateDotaCacheDto, UpdateDotaCacheDto } from '../models/dota-cache-request.dto';
import type { GetAllDotaCachesResponse, GetDotaCacheByIdResponse } from '../models/dota-cache-response.dto';

const BASE_URL = '/dota-cache';

export const dotaCacheService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllDotaCachesResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetDotaCacheByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateDotaCacheDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateDotaCacheDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
