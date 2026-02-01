import { apiClient } from '@/config/api/api-client';
import { CreateAccountDto, UpdateAccountDto } from '../models/account-request.dto';
import { GetAllAccountsResponse, GetAccountByIdResponse } from '../models/account-response.dto';

const BASE_URL = '/account';

export const accountService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllAccountsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetAccountByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateAccountDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateAccountDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
