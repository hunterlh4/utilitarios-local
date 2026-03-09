import { apiClient } from '@/config/api/api-client';
import type { CreateTaskListDto, UpdateTaskListDto, CreateTaskDto, UpdateTaskDto } from '../models/task-request.dto';
import type { GetAllTaskListsResponse, GetTaskListByIdResponse } from '../models/task-response.dto';

const BASE_URL = '/task-list';

export const taskService = {
  getAll: async () => {
    const response = await apiClient.get<GetAllTaskListsResponse>(BASE_URL);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<GetTaskListByIdResponse>(`${BASE_URL}/${id}`);
    return response.data;
  },

  createList: async (data: CreateTaskListDto) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  updateList: async (id: string, data: UpdateTaskListDto) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  deleteList: async (id: string) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskDto) => {
    const response = await apiClient.post(`${BASE_URL}/task`, data);
    return response.data;
  },

  updateTask: async (id: string, data: UpdateTaskDto) => {
    const response = await apiClient.put(`${BASE_URL}/task/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string) => {
    const response = await apiClient.delete(`${BASE_URL}/task/${id}`);
    return response.data;
  },
};
