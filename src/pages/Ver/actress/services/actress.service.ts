import { apiClient } from '@/config/api/api-client';
import { CreateActressDto, UpdateActressDto } from '../models/actress-request.dto';
import { GetAllActressesResponse, GetActressByIdResponse } from '../models/actress-response.dto';

const BASE_URL = '/actress';

export const actressService = {
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

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
