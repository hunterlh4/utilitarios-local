import { apiClient } from '@/config/api/api-client';

export interface ActressJav {
  id: number;
  name: string;
}

export const actressJavService = {
  getAll: async (): Promise<ActressJav[]> => {
    return await apiClient.get('/actress-jav');
  },
};
