import { apiClient } from '@/config/api/api-client';
import type { CreateAnimeDto, UpdateAnimeDto } from '../models/anime-request.dto';
import type { Anime } from '../models/anime.model';

const BASE_URL = '/anime';

export const animeService = {
  getAll: async (): Promise<Anime[]> => {
    return await apiClient.get<Anime[]>(BASE_URL);
  },

  getById: async (id: number): Promise<Anime> => {
    return await apiClient.get<Anime>(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateAnimeDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateAnimeDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  updateStatus: async (id: number, status: number) => {
    return await apiClient.patch(`${BASE_URL}/${id}/status`, { status });
  },
};
