import { apiClient } from '@/config/api/api-client';
import type { CreateHentaiDto, UpdateHentaiDto } from '../models/hentai-request.dto';
import type { Hentai } from '../models/hentai.model';

const BASE_URL = '/hentai';

export const hentaiService = {
  getAll: async (): Promise<Hentai[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<Hentai> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateHentaiDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateHentaiDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  updateStatus: async (id: number, status: number) => {
    return await apiClient.patch(`${BASE_URL}/${id}/status`, { status });
  },
};
