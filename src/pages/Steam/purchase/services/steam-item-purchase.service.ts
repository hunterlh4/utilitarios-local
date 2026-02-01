import { apiClient } from '@/config/api/api-client';
import { CreateSteamItemPurchaseDto, UpdateSteamItemPurchaseDto } from '../models/steam-item-purchase-request.dto';
import { GetAllSteamItemPurchasesResponse, GetSteamItemPurchaseByIdResponse } from '../models/steam-item-purchase-response.dto';

const BASE_URL = '/steam-item-purchase';

export const steamItemPurchaseService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllSteamItemPurchasesResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetSteamItemPurchaseByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSteamItemPurchaseDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSteamItemPurchaseDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
