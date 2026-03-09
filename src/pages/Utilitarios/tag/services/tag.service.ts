import { apiClient } from '@/config/api/api-client';
import type { Tag } from '../models/tag.model';
import type { CreateTagDto, UpdateTagDto } from '../models/tag-request.dto';

const BASE_URL = '/tag';

export const tagService = {
  getByType: async (type: number): Promise<Tag[]> => {
    return await apiClient.get(`${BASE_URL}/type/${type}`);
  },

  create: async (data: CreateTagDto): Promise<Tag> => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateTagDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
