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
    return await apiClient.get(`/tag/type/${type}`);
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
