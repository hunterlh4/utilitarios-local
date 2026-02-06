import { apiClient } from '@/config/api/api-client';
import type { AnimeGalery, Media } from '../models/anime-galery.model';

const BASE_URL = '/animegalery';
const UPLOAD_URL = '/upload';

export const animeGaleryService = {
  getAll: async (): Promise<AnimeGalery[]> => {
    return await apiClient.get(BASE_URL);
  },

  create: async (name: string): Promise<{ id: number }> => {
    return await apiClient.post(BASE_URL, { name });
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  getMediaByRefId: async (refId: number): Promise<Media[]> => {
    return await apiClient.get(`${BASE_URL}/${refId}/media`);
  },

  uploadImage: async (file: File, refId: number) => {
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
};
