import { apiClient } from '@/config/api/api-client';
import type { CreateActressDto, UpdateActressDto } from '../models/actress-request.dto';
import type { GetAllActressesResponse, GetActressByIdResponse } from '../models/actress-response.dto';

const BASE_URL = '/actress-jav';

export const actressJavService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllActressesResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetActressByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateActressDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateActressDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  updateLinks: async (id: number, links: string[]) => {
    const response = await apiClient.put(`${BASE_URL}/${id}/links`, links);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  getJavsByActress: async (actressId: number) => {
    const response = await apiClient.get(`${BASE_URL}/${actressId}/javs`);
    return response.data;
  },

  checkNameExists: async (name: string) => {
    const response = await apiClient.get<boolean>(`${BASE_URL}/check/${encodeURIComponent(name)}`);
    return response.data;
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
