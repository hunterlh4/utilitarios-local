import { apiClient } from '@/config/api/api-client';
import { VideoSourceMap } from '@/common/enums/video-source.enum';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';
import type { ActressAdult, ActressAdultBasic, ActressAdultDetail, CreateVideoAdultDto } from '../models/actressAdult.model';

const BASE_URL = '/actress-adult';

export const actressAdultService = {
  getAll: async (): Promise<ActressAdult[]> => {
    return await apiClient.get(BASE_URL);
  },

  getById: async (id: number): Promise<ActressAdultBasic> => {
    return await apiClient.get(`${BASE_URL}/${id}`);
  },

  getDetailById: async (id: number): Promise<ActressAdultDetail> => {
    return await apiClient.get(`${BASE_URL}/${id}/detail`);
  },

  create: async (name: string, tagIds: number[] = []): Promise<{ id: number }> => {
    return await apiClient.post(BASE_URL, { name, tagIds });
  },

  update: async (id: number, name: string, tagIds: number[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}`, { name, tags: tagIds });
  },

  delete: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/${id}`);
  },

  createVideo: async (data: CreateVideoAdultDto): Promise<void> => {
    // Convertir source string a enum usando el mapa
    const sourceEnum = VideoSourceMap[data.source.toLowerCase()];
    
    return await apiClient.post(`${BASE_URL}/video`, {
      source: sourceEnum,
      videoUrl: data.videoUrl,
      actressIds: data.actressIds,
      tagIds: data.tagIds,
    });
  },

  updateVideo: async (videoId: number, actressIds: number[], tagIds: number[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/video/${videoId}`, { actressIds, tagIds });
  },

  updateVideoStatus: async (videoId: number, status: number): Promise<void> => {
    return await apiClient.patch(`${BASE_URL}/video/${videoId}/status`, { status });
  },

  deleteVideo: async (videoId: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/video/${videoId}`);
  },

  updateLinks: async (id: number, links: string[]): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/${id}/links`, links);
  },

  uploadImage: async (file: File, refId: number) => {
    const formData = new FormData();
    formData.append('image', file);

    return await apiClient.post(`${BASE_URL}/${refId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  exportExcel: async (): Promise<ExcelFileDto> => {
    return await apiClient.get(`${BASE_URL}/export`);
  },

  importExcel: async (file: File): Promise<ImportExcelResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.post(`${BASE_URL}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
