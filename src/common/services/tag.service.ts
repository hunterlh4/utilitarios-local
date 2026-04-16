import { apiClient } from '@/config/api/api-client';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';

export interface Tag {
  id: number;
  name: string;
  type: number;
}

export interface CreateTagDto {
  name: string;
  type: number;
}

export interface UpdateTagDto {
  name: string;
}

export const tagService = {
  getByType: async (type: number): Promise<Tag[]> => {
    return await apiClient.get(`/tag/type/${type}`);
  },

  exportExcel: async (): Promise<ExcelFileDto> => {
    return await apiClient.get('/tag/export');
  },

  importExcel: async (file: File): Promise<ImportExcelResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.post('/tag/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  create: async (data: CreateTagDto) => {
    return await apiClient.post('/tag', data);
  },

  update: async (id: number, data: UpdateTagDto) => {
    return await apiClient.put(`/tag/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`/tag/${id}`);
  },
};
