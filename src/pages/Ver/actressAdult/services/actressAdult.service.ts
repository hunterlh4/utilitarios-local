import { apiClient } from '@/config/api/api-client';
import type { ActressAdult, ActressAdultBasic, ActressAdultDetail, CreateVideoAdultDto } from '../models/actressAdult.model';

const BASE_URL = '/actress-adult';
const UPLOAD_URL = '/upload';

export const actressAdultService = {
  getAll: async (): Promise<ActressAdult[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<ActressAdultBasic> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  getDetailById: async (id: number): Promise<ActressAdultDetail> => {
    return await apiClient.get(`${BASE_URL}/${id}/detail`);
  },

  create: async (name: string, tagIds: number[] = []): Promise<{ id: number }> => {
    return await apiClient.post(BASE_URL, { name, tagIds });
  },

  update: async (id: number, name: string, tagIds: number[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, { name, tags: tagIds });
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  createVideo: async (data: CreateVideoAdultDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/video`, data);
  },

  updateVideo: async (videoId: number, actressIds: number[], tagIds: number[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/video/${videoId}`, { actressIds, tagIds });
  },

  deleteVideo: async (videoId: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/video/${videoId}`);
  },

  updateLinks: async (id: number, links: string[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}/links`, links);
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

  deleteMedia: async (mediaId: number): Promise<void> => {
    return await apiClient.delete(`${UPLOAD_URL}/media/${mediaId}`);
  },
};
