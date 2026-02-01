import { apiClient } from '@/config/api/api-client';
import { CreateSeriesDto, UpdateSeriesDto } from '../models/series-request.dto';
import { GetAllSeriesResponse, GetSeriesByIdResponse } from '../models/series-response.dto';

const BASE_URL = '/series';

export const seriesService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllSeriesResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetSeriesByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateSeriesDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateSeriesDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
