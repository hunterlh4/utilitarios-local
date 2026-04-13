import { apiClient } from '@/config/api/api-client';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';
import type { AnimeGalery, AnimeGaleryDetail, UpdateAnimeGaleryDto } from '../models/anime-galery.model';

const BASE_URL = 'galery/anime';
const UPLOAD_URL = '/upload';

export const animeGaleryService = {
  getAll: async (): Promise<AnimeGalery[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<AnimeGaleryDetail> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (name: string): Promise<{ id: number }> => {
    return await apiClient.post(BASE_URL, { name });
  },

  update: async (id: number, payload: UpdateAnimeGaleryDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, payload);
  },

  updateLinks: async (id: number, links: string[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}/links`, links);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  uploadImage: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    return await apiClient.post(`${BASE_URL}/${refId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  uploadMedia: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', '2'); // 2 = AnimeGalery
    formData.append('refId', refId.toString());

    return await apiClient.post(`${UPLOAD_URL}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
