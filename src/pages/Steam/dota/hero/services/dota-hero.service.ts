import { apiClient } from '@/config/api/api-client';
import type { CreateDotaHeroDto, UpdateDotaHeroDto } from '../models/dota-hero-request.dto';
import type { GetAllDotaHeroesResponse, GetDotaHeroByIdResponse } from '../models/dota-hero-response.dto';

const BASE_URL = '/dota-hero';

export const dotaHeroService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllDotaHeroesResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetDotaHeroByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateDotaHeroDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateDotaHeroDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
