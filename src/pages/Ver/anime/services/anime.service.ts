import { apiClient } from '@/config/api/api-client';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';
import type { CreateAnimeDto, UpdateAnimeDto } from '../models/anime-request.dto';
import type { Anime } from '../models/anime.model';

const BASE_URL = '/anime';

export const animeService = {
  getAll: async (): Promise<Anime[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<Anime> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
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

  exportExcel: async (): Promise<ExcelFileDto> => {
    return await apiClient.get(`${BASE_URL}/export`);
  },

  importExcel: async (file: File): Promise<ImportExcelResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.post(`${BASE_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
