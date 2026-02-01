import { apiClient } from '@/config/api/api-client';
import { CreateGirlDto, UpdateGirlDto } from '../models/girl-request.dto';
import { GetAllGirlsResponse, GetGirlByIdResponse } from '../models/girl-response.dto';

const BASE_URL = '/girl-galery';

export const girlService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllGirlsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetGirlByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateGirlDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateGirlDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
