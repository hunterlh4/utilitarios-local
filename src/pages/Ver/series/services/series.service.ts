import { apiClient } from '@/config/api/api-client';
import type { CreateSeriesDto, UpdateSeriesDto } from '../models/series-request.dto';
import type { Series } from '../models/series.model';

const BASE_URL = '/series';

export const seriesService = {
  getAll: async (): Promise<Series[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<Series> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateSeriesDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateSeriesDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  updateStatus: async (id: number, status: number) => {
    return await apiClient.patch(`${BASE_URL}/${id}/status`, { status });
  },

  searchImdb: async (query: string) => {
    const response = await fetch(
      `https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(query)}&limit=50`
    );
    return await response.json();
  },
};
