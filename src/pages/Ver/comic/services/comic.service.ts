import { apiClient } from '@/config/api/api-client';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';
import type { CreateComicDto, UpdateComicDto } from '../models/comic-request.dto';
import type { Comic } from '../models/comic.model';

const BASE_URL = '/comic';

export const comicService = {
  getAll: async (): Promise<Comic[]> => {
    return await apiClient.get(BASE_URL);
  },

  create: async (data: CreateComicDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateComicDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  uploadImage: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    return await apiClient.post(`${BASE_URL}/${refId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  exportExcel: async (): Promise<ExcelFileDto> => {
    return await apiClient.get(`${BASE_URL}/export`);
  },

  importExcel: async (file: File): Promise<ImportExcelResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(`${BASE_URL}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
