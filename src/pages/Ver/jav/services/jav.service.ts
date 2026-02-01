import { apiClient } from '@/config/api/api-client';
import { CreateJavDto, UpdateJavDto } from '../models/jav-request.dto';
import { GetAllJavResponse, GetJavByIdResponse } from '../models/jav-response.dto';

const BASE_URL = '/jav';

export const javService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllJavResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetJavByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateJavDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateJavDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
