import { apiClient } from '@/config/api/api-client';
import type { CreateProjectDto, UpdateProjectDto } from '../models/project-request.dto';
import type { Project, ProjectDetail } from '../models/project.model';

const BASE_URL = '/project';

export const projectService = {
  getAll: async (): Promise<Project[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<ProjectDetail> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  create: async (data: CreateProjectDto): Promise<number> => {
    return await apiClient.post(BASE_URL, data);
  },

  update: async (id: number, data: UpdateProjectDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  addImageUrl: async (id: number, url: string): Promise<number> => {
    return await apiClient.post(`${BASE_URL}/${id}/images/url`, { url });
  },

  uploadImages: async (id: number, files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    return await apiClient.post(`${BASE_URL}/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteMedia: async (mediaId: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/media/${mediaId}`);
  },
};
