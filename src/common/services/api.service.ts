import { apiClient } from '@/config/api/axios.config';

export class ApiService {
  static async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return apiClient.get<T, T>(endpoint, { params });
  }

  static async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiClient.post<T, T>(endpoint, data);
  }

  static async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiClient.put<T, T>(endpoint, data);
  }

  static async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiClient.patch<T, T>(endpoint, data);
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return apiClient.delete<T, T>(endpoint);
  }
}
