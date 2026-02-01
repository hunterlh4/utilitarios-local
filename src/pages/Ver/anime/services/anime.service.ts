import { apiClient } from '@/config/api/api-client';
import { CreateAnimeDto, UpdateAnimeDto } from '../models/anime-request.dto';
import { GetAllAnimeResponse, GetAnimeByIdResponse } from '../models/anime-response.dto';

const BASE_URL = '/anime';

export const animeService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllAnimeResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetAnimeByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateAnimeDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateAnimeDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
