import { apiClient } from '@/config/api/api-client';
import { CreateAnimeGaleryDto, UpdateAnimeGaleryDto } from '../models/anime-galery-request.dto';
import { GetAllAnimeGaleryResponse, GetAnimeGaleryByIdResponse } from '../models/anime-galery-response.dto';

const BASE_URL = '/anime-galery';

export const animeGaleryService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllAnimeGaleryResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetAnimeGaleryByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateAnimeGaleryDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateAnimeGaleryDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
