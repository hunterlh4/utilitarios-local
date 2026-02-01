import { apiClient } from '@/config/api/api-client';
import { CreatePostDto, UpdatePostDto } from '../models/post-request.dto';
import { GetAllPostsResponse, GetPostByIdResponse } from '../models/post-response.dto';

const BASE_URL = '/post';

export const postService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllPostsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: number) => {
    const response = await apiClient.get<GetPostByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreatePostDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  update: async (id: number, data: UpdatePostDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
