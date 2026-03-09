import { apiClient } from '@/config/api/api-client';
import type { CreateProyectDto, UpdateProyectDto } from '../models/project-request.dto';
import type { GetAllProyectsResponse, GetProyectByIdResponse } from '../models/project-response.dto';

const BASE_URL = '/proyect';

export const proyectService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllProyectsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetProyectByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateProyectDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateProyectDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
