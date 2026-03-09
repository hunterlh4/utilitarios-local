import { apiClient } from '@/config/api/api-client';

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
    const response = await apiClient.get(`/tag/type/${type}`);
    return response.data;
  },

  create: async (data: CreateTagDto) => {
    const response = await apiClient.post('/tag', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTagDto) => {
    const response = await apiClient.put(`/tag/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`/tag/${id}`);
    return response.data;
  },
};
