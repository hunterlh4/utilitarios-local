import { apiClient } from '@/config/api/api-client';
import { CreateEventDto, UpdateEventDto } from '../models/event-request.dto';
import { GetAllEventsResponse, GetEventByIdResponse } from '../models/event-response.dto';

const BASE_URL = '/event';

export const eventService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllEventsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<GetEventByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateEventDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateEventDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
