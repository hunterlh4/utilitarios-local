import { apiClient } from '@/config/api/api-client';
import type { CreateActressDto, UpdateActressDto } from '../models/actress-request.dto';
import type { GetAllActressesResponse, GetActressByIdResponse } from '../models/actress-response.dto';
import type { JavSummary } from '../models/jav-summary.model';

const BASE_URL = '/actress-jav';

export const actressJavService = {
  getAll: async (): Promise<GetAllActressesResponse> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<GetActressByIdResponse> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateActressDto) => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateActressDto) => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  updateLinks: async (id: number, links: string[]) => {
    return await apiClient.put(`${BASE_URL}/${id}/links`, links);
  },

  delete: async (id: number) => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  getJavsByActress: async (actressId: number): Promise<JavSummary[]> => {
    return await apiClient.get(`${BASE_URL}/${actressId}/javs`);
  },

  checkNameExists: async (name: string): Promise<boolean> => {
    return await apiClient.get(`${BASE_URL}/check/${encodeURIComponent(name)}`);
  },

  uploadImage: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', '4'); // 4 = ActressJav
    formData.append('refId', refId.toString());

    return await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteMedia: async (mediaId: number) => {
    return await apiClient.delete(`/upload/media/${mediaId}`);
  },
};
