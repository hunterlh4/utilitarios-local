import { apiClient } from '@/config/api/api-client';
import type { ExcelFileDto, ImportExcelResult } from '@/common/models/excel.model';
import type {
  AccountEmail, AccountSteam, AccountGitHub, AccountGeneral, AccountKiro,
} from '../models/account.model';
import type {
  CreateEmailDto, UpdateEmailDto,
  CreateSteamDto, UpdateSteamDto,
  CreateGitHubDto, UpdateGitHubDto,
  CreateGeneralDto, UpdateGeneralDto,
  CreateKiroDto, UpdateKiroDto,
} from '../models/account-request.dto';

const BASE_URL = '/account';

export const accountService = {
  // Email
  getEmails: async (): Promise<AccountEmail[]> => {
    return await apiClient.get(`${BASE_URL}/email`);
  },
  createEmail: async (data: CreateEmailDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/email`, data);
  },
  updateEmail: async (id: number, data: UpdateEmailDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/email/${id}`, data);
  },
  deleteEmail: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/email/${id}`);
  },

  // Steam
  getSteams: async (): Promise<AccountSteam[]> => {
    return await apiClient.get(`${BASE_URL}/steam`);
  },
  createSteam: async (data: CreateSteamDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/steam`, data);
  },
  updateSteam: async (id: number, data: UpdateSteamDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/steam/${id}`, data);
  },
  deleteSteam: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/steam/${id}`);
  },

  // GitHub
  getGitHubs: async (): Promise<AccountGitHub[]> => {
    return await apiClient.get(`${BASE_URL}/github`);
  },
  createGitHub: async (data: CreateGitHubDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/github`, data);
  },
  updateGitHub: async (id: number, data: UpdateGitHubDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/github/${id}`, data);
  },
  deleteGitHub: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/github/${id}`);
  },

  // General
  getGenerals: async (): Promise<AccountGeneral[]> => {
    return await apiClient.get(`${BASE_URL}/general`);
  },
  createGeneral: async (data: CreateGeneralDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/general`, data);
  },
  updateGeneral: async (id: number, data: UpdateGeneralDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/general/${id}`, data);
  },
  deleteGeneral: async (id: number): Promise<void> => {
    return await apiClient.delete(`${BASE_URL}/general/${id}`);
  },

  // Kiro
  getKiro: async (): Promise<AccountKiro | null> => {
    const result = await apiClient.get<AccountKiro[]>(`${BASE_URL}/kiro`);
    // El endpoint devuelve un array, pero solo hay una cuenta Kiro
    return (Array.isArray(result) && result.length > 0) ? result[0] : null;
  },
  createKiro: async (data: CreateKiroDto): Promise<void> => {
    return await apiClient.post(`${BASE_URL}/kiro`, data);
  },
  updateKiro: async (id: number, data: UpdateKiroDto): Promise<void> => {
    return await apiClient.put(`${BASE_URL}/kiro/${id}`, data);
  },
  useKiro: async (id: number): Promise<void> => {
    return await apiClient.patch(`${BASE_URL}/kiro/${id}/use`, {});
  },
  resetKiro: async (): Promise<number> => {
    return await apiClient.post(`${BASE_URL}/kiro/reset`, {});
  },

  exportExcel: async (): Promise<ExcelFileDto> => {
    return await apiClient.get(`${BASE_URL}/export`);
  },

  importExcel: async (file: File): Promise<ImportExcelResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return await apiClient.post(`${BASE_URL}/import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
