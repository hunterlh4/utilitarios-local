import { apiClient } from '@/config/api/api-client';
import type { CreateJavDto, UpdateJavDto } from '../models/jav-request.dto';
import type { Jav } from '../models/jav.model';

const BASE_URL = '/jav';

export const javService = {
  getAll: async (): Promise<Jav[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<Jav> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateJavDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateJavDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  checkCodeExists: async (code: string): Promise<boolean> => {
    return await apiClient.get(`${BASE_URL}/check/${code}`);
  },

  updateStatus: async (id: number, status: number) => {
    return await apiClient.patch(`${BASE_URL}/${id}/status`, { status });
  },

  importExcel: async (file: File): Promise<{ javsCreated: number; actressesCreated: number; skipped: number; invalid: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(`${BASE_URL}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadImage: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    return await apiClient.post(`${BASE_URL}/${refId}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  bulkCreate: async (data: {
    code: string;
    actresses: { name: string; url?: string }[];
    image?: string;
    links: string[];
    createdAt?: string;
  }) => {
    return await apiClient.post(`${BASE_URL}/bulk`, data);
  },
};
