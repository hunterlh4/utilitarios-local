import { apiClient } from '@/config/api/api-client';
import type { ActressAdult, ActressAdultDetail, CreateVideoAdultDto } from '../models/actressAdult.model';

const BASE_URL = '/actress-adult';
const UPLOAD_URL = '/upload';

export const actressAdultService = {
  getAll: async (): Promise<ActressAdult[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<ActressAdultDetail> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (name: string): Promise<{ id: number }> => {
    return await apiClient.post(BASE_URL, { name });
  },

  update: async (id: number, name: string): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, { name });
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  createVideo: async (data: CreateVideoAdultDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/video`, data);
  },

  uploadImage: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', '5'); // 5 = ActressAdult
    formData.append('refId', refId.toString());

    return await apiClient.post(`${UPLOAD_URL}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
