import { apiClient } from '@/config/api/api-client';

export interface Tag {
  id: number;
  name: string;
  type: number;
}

export const tagService = {
  getByType: async (type: number): Promise<Tag[]> => {
    return await apiClient.get(`/tags?type=${type}`);
  },
};
