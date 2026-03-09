import { apiClient } from '@/config/api/api-client';

export interface Tag {
  id: number;
  name: string;
  type: number;
}

export const tagService = {
  getByType: async (type: number): Promise<Tag[]> => {
    const response = await apiClient.get(`/tag/type/${type}`);
    return response.data;
  },
};
