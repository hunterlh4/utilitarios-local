import { apiClient } from '@/config/api/api-client';
import { CreatePaymentDto, UpdatePaymentDto } from '../models/payment-request.dto';
import { GetAllPaymentsResponse, GetPaymentByIdResponse } from '../models/payment-response.dto';

const BASE_URL = '/payment';

export const paymentService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllPaymentsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetPaymentByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreatePaymentDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdatePaymentDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
