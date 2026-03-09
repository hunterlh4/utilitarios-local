import { apiClient } from '@/config/api/api-client';
import type { CreateDotaTreasureDto, UpdateDotaTreasureDto } from '../models/dota-treasure-request.dto';
import type { GetAllDotaTreasuresResponse, GetDotaTreasureByIdResponse } from '../models/dota-treasure-response.dto';

const BASE_URL = '/dota-treasure';

export const dotaTreasureService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllDotaTreasuresResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetDotaTreasureByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateDotaTreasureDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateDotaTreasureDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
