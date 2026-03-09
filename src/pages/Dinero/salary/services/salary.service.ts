import { apiClient } from '@/config/api/api-client';
import type { CreateSalaryDto, UpdateSalaryDto } from '../models/salary-request.dto';
import type { GetSalaryResponse } from '../models/salary-response.dto';

const BASE_URL = '/salary';

export const salaryService = {
  get: async () => {
    const response = await apiClient.get<GetSalaryResponse>(BASE_URL);
    return response.data;
  },

  create: async (data: CreateSalaryDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSalaryDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },
};
