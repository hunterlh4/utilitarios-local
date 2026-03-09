import { apiClient } from '@/config/api/api-client';
import type { CreateSellerDto, UpdateSellerDto } from '../models/seller-request.dto';
import type { GetAllSellersResponse, GetSellerByIdResponse } from '../models/seller-response.dto';

const BASE_URL = '/seller';

export const sellerService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllSellersResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetSellerByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSellerDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSellerDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
