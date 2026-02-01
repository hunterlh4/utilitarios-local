import { apiClient } from '@/config/api/api-client';
import { CreateYouTubeDto, UpdateYouTubeDto } from '../models/youtube-request.dto';
import { GetAllYouTubeResponse, GetYouTubeByIdResponse } from '../models/youtube-response.dto';

const BASE_URL = '/youtube';

export const youtubeService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllYouTubeResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetYouTubeByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateYouTubeDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdateYouTubeDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
