import { apiClient } from '@/config/api/api-client';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';
import type { CreateYouTubeDto, UpdateYouTubeDto } from '../models/youtube-request.dto';
import type { YouTube } from '../models/youtube.model';

const BASE_URL = '/youtube';

export const youtubeService = {
  getAll: async (): Promise<YouTube[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<YouTube> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateYouTubeDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateYouTubeDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
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
