import { apiClient } from '@/config/api/api-client';
import type { Account } from '../models/account.model';
import type { CreateAccountDto, UpdateAccountDto } from '../models/account-request.dto';

const BASE_URL = '/account';

export const accountService = {
  getAll: async (): Promise<Account[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<Account> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateAccountDto): Promise<Account> => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateAccountDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },
};
