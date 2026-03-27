import { apiClient } from '@/config/api/api-client';
import type { Account } from '../models/account.model';
import type { CreateAccountDto, UpdateAccountDto } from '../models/account-request.dto';
import type { AccountType } from '../enums/account.enum';

const BASE_URL = '/account';

export const accountService = {
  getAll: async (type?: AccountType): Promise<Account[]> => {
    const params = type ? { type } : undefined;
    const response = await apiClient.get<Account[]>(BASE_URL, { params });
    return response as unknown as Account[];
  },

  create: async (data: CreateAccountDto): Promise<number> => {
    const response = await apiClient.post<number>(BASE_URL, data);
    return response as unknown as number;
  },

  update: async (id: number, data: UpdateAccountDto): Promise<void> => {
    await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  },

  use: async (id: number): Promise<void> => {
    await apiClient.patch(`${BASE_URL}/${id}/use`, {});
  },
};
